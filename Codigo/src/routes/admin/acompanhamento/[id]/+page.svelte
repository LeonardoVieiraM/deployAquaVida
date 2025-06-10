<script lang="ts">
	import { format } from 'date-fns';
	import type { PageData } from './$types';
	import type { SelectPedido, SelectServico } from '$lib/server/db/schema';
	import { enhance } from '$app/forms';
	import { el } from 'date-fns/locale';
	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas';
	import { jsPDF } from 'jspdf';
	import { DropletIcon } from 'lucide-svelte';

	export let data: PageData;

	let contrato = data.contrato;
	let pedidos = data.pedidos;

	let isOpenModal: HTMLDialogElement | null = null;
	let selectedPedido: SelectPedido = {
		id: 1,
		gerente_id: 1,
		description: '',
		status: 'pendente',
		servico_id: 1,
		cliente_id: contrato.cliente_id
	};
	let selectedServico: SelectServico = {
		id: 1,
		name: '',
		description: ''
	};

	function openEditModal(pedido: SelectPedido, servico: SelectServico) {
		selectedPedido = { ...pedido };
		selectedServico = servico;
		isOpenModal?.showModal();
	}

	// gerar PDF
	async function generatePDF() {
		try {
			// Criar um container temporário fora da tela
			const pdfContainer = document.createElement('div');
			pdfContainer.style.position = 'fixed';
			pdfContainer.style.left = '-9999px';
			pdfContainer.style.top = '0';
			pdfContainer.style.width = '800px';
			pdfContainer.style.backgroundColor = '#ffffff';
			pdfContainer.style.padding = '20px';
			pdfContainer.style.boxSizing = 'border-box';
			document.body.appendChild(pdfContainer);

			// Clona conteudo do contrato
			const originalContent = document.getElementById('contract-content');
			if (!originalContent) {
				throw new Error('Conteúdo do contrato não encontrado');
			}
			const contentClone = originalContent.cloneNode(true) as HTMLElement;

			// Remover cores oklch
			contentClone.classList.remove('bg-base-200', 'border-base-300');
			contentClone.style.backgroundColor = '#ffffff';
			contentClone.style.color = '#333333';
			contentClone.style.fontFamily = 'Arial, sans-serif';
			contentClone.style.lineHeight = '1.5';

			// Substitue oklch
			const elements = contentClone.querySelectorAll('*');
			elements.forEach((el: HTMLElement) => {
				el.classList.remove(
					'bg-base-200',
					'text-primary',
					'border-base-300',
					'btn-primary',
					'btn-success',
					'btn-error'
				);

				const styles = window.getComputedStyle(el);
				if (styles.backgroundColor.includes('oklch')) {
					el.style.backgroundColor = '#ffffff';
				}
				if (styles.color.includes('oklch')) {
					el.style.color = '#333333';
				}
				if (styles.borderColor.includes('oklch')) {
					el.style.borderColor = '#dddddd';
				}
			});

			// Adiciona estilos para PDF
			const safeStyles = document.createElement('style');
			safeStyles.textContent = `
            * {
                color: #333333 !important;
                background-color: #ffffff !important;
                border-color: #dddddd !important;
            }
            h1, h2, h3 {
                color: #111111 !important;
                page-break-after: avoid !important;
            }
            p {
                margin: 5px 0 !important;
                page-break-inside: avoid !important;
            }
            .btn {
                display: none !important;
            }
			`;
			contentClone.prepend(safeStyles);

			pdfContainer.appendChild(contentClone);

			await new Promise((resolve) => setTimeout(resolve, 500));

			const options = {
				scale: 2,
				logging: true,
				useCORS: true,
				backgroundColor: '#ffffff',
				scrollX: 0,
				scrollY: 0,
				windowWidth: 800,
				height: pdfContainer.scrollHeight,
				ignoreElements: (el: Element) => el.classList.contains('btn'), // Ignorar botões
				onclone: (clonedDoc) => {
					const textElements = clonedDoc.querySelectorAll('p, span, div');
					textElements.forEach((el: HTMLElement) => {
						el.style.whiteSpace = 'normal';
						el.style.overflow = 'visible';
						el.style.textOverflow = 'clip';
					});
				}
			};

			// Gera canvas
			const canvas = await html2canvas(pdfContainer, options);
			document.body.removeChild(pdfContainer);

			if (!canvas) {
				throw new Error('Falha ao criar canvas');
			}

			// Cria PDF
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgData = canvas.toDataURL('image/png', 1.0);
			const imgWidth = 190;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

			// Adiciona informações
			pdf.setProperties({
				title: `Contrato ${contrato.id}`,
				subject: `Contrato com ${contrato.cliente?.name || 'Cliente'}`,
				author: 'Sistema de Contratos'
			});

			// Adiciona cabeçalho e rodapé
			pdf.setFontSize(16);
			pdf.setTextColor(40);
			pdf.text(`Contrato #${contrato.id}`, 105, 10, { align: 'center' });

			pdf.setFontSize(10);
			const dateStr = format(new Date(), 'dd/MM/yyyy HH:mm');
			pdf.text(`Gerado em: ${dateStr}`, 14, 287);
			pdf.text(`Página 1 de 1`, 105, 287, { align: 'center' });

			// Salvar o PDF
			const fileName = `Contrato_${contrato.id}_${(contrato.cliente?.name || 'Cliente').replace(/\s+/g, '_')}.pdf`;
			pdf.save(fileName);
		} catch (error) {
			console.error('Erro ao gerar PDF:', {
				error,
				message: error.message,
				stack: error.stack
			});
			alert('Erro ao gerar PDF. Por favor, tente novamente ou entre em contato com o suporte.');
		}
	}
</script>

{#if contrato}
	<div class="container mx-auto p-6">
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="space-y-6">
				<div>
					<h2 class="text-xl font-semibold mb-4">Pedidos de {contrato.cliente?.name}</h2>
					<div class="bg-base-200 rounded-lg p-4 space-y-2">
						{#if pedidos.length > 0}
							{#each pedidos as pedido}
								<div class="flex justify-between items-center p-3 rounded">
									<span>Pedido #{pedido.pedidos?.id} - Status: {pedido.pedidos.status}</span>
									<button
										class="btn btn-sm btn-primary"
										on:click={() => {
											if (pedido.servico) {
												openEditModal(pedido.pedidos, pedido.servico);
											} else {
												console.error('Serviço não encontrado para este pedido.');
											}
										}}>Visualizar</button
									>
								</div>
							{/each}
						{:else}
							Nenhum pedido para: {contrato.cliente?.name}
						{/if}
					</div>
				</div>

				<div>
					<h2 class="text-xl font-semibold mb-4">Relatorios</h2>
					<div class="bg-base-200 rounded-lg p-6 space-y-2">
						{#if contrato.relatorio.length > 0}
							{#each contrato.relatorio as relatorio}
								<div class="flex justify-between items-center rounded">
									<h1>Relatorio: {relatorio.id} - {relatorio.nome}</h1>
									<a href="/customer/relatorio/{relatorio.id}" class="btn btn-sm btn-primary"
										>Visualizar</a
									>
								</div>
							{/each}
						{:else}
							Não possui
						{/if}
						<!-- <div class="flex justify-between items-center rounded">
						<h1>Novo relatorio</h1>
						<a href="/customer/relatorio/" class="btn btn-sm btn-secondary">Criar</a>
					</div> -->
					</div>
				</div>

				{#if data.fullUser.tipo === 'gerente'}
					<a class="btn btn-primary w-full" href="/admin/contratos/{contrato.id}">Editar Contrato</a
					>
				{/if}
			</div>

			<div id="contract-content" class="p-6 bg-base-200 rounded-lg">
				<div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
					<div class="text-center mb-8">
						<DropletIcon class="h-6 w-6 mx-auto mb-2 text-primary" />
						<h2 class="text-2xl font-bold uppercase tracking-wide">
							Contrato de Prestação de Serviços
						</h2>
						<p class="text-gray-600 mt-1">Nº {contrato.id}</p>
					</div>

					<!-- Contratantes -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						<div>
							<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">CONTRATANTE</h3>
							<p class="font-medium">{contrato.cliente?.name || 'Nome do cliente'}</p>
							<p>
								Representante: {contrato.cliente?.representante?.name || 'Nome do representante'}
							</p>
							<p>Email: {contrato.cliente?.email || 'Email do cliente'}</p>
						</div>
						<div>
							<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">CONTRATADA</h3>
							<p class="font-medium">Aqua Vida</p>
							<p>CNPJ: XX.XXX.XXX/XXX-XX</p>
							<p>Endereço: Rua Exemplo, 123 - Cidade/Estado</p>
						</div>
					</div>

					<!-- Serviços -->
					<div class="mb-8">
						<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">SERVIÇOS</h3>
						<div class="space-y-3 text-justify">
							{#if contrato.descricao}
								<p class="whitespace-pre-wrap">{@html contrato.descricao}</p>
							{:else}
								<p class="italic text-gray-500">Sem serviços específicos definidos</p>
							{/if}
						</div>
					</div>

					<!-- Valores e Datas -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						<div>
							<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">VALORES</h3>
							<p>
								<span class="font-medium">Total:</span> R$ {contrato.valor_pagamento.toFixed(2)}
							</p>
							<!--<p>
								<span class="font-medium">Status:</span>
								{#if contrato.status_pagamento === 'pago'}
									<span class="badge badge-success">Pago</span>
								{:else if contrato.status_pagamento === 'processando'}
									<span class="badge badge-warning">Processando</span>
								{:else}
									<span class="badge badge-error">Pendente</span>
								{/if}
							</p>-->
						</div>
						<div>
							<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">VIGÊNCIA</h3>
							<p>
								<span class="font-medium">Emissão:</span>
								{format(contrato.date_emission, 'dd/MM/yyyy')}
							</p>
							<p>
								<span class="font-medium">Vencimento:</span>
								{format(contrato.date_expire, 'dd/MM/yyyy')}
							</p>
						</div>
					</div>

					<!-- Assinaturas -->
					<div class="mt-12 pt-8 border-t border-gray-300">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div class="text-center">
								<p class="mb-12 border-b border-black pb-1 w-3/4 mx-auto"></p>
								<p class="mt-2 font-medium">Contratante</p>
							</div>
							<div class="text-center">
								<p class="mb-12 border-b border-black pb-1 w-3/4 mx-auto"></p>
								<p class="mt-2 font-medium">Contratada</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!--<div id="contract-content" class="p-6 bg-base-200 rounded-lg">
				<div class="space-y-6">
					<h2 class="text-xl font-semibold">{contrato.nome || 'Nome do contrato'}</h2>
					<div class="w-full text-sm space-y-2">
						<div class="  rounded">Cliente: {contrato.cliente?.name || 'Nome do cliente'}</div>
						<div class="  rounded">
							Representante: {contrato.cliente?.representante?.name || 'Nome do representante'}
						</div>
					</div>
					<hr />
					<p class="text-sm mt-0">
						Serviços: {@html contrato.descricao}
					</p>
					<div class="pt-4 border-t border-base-300">
						<h3 class="font-semibold mb-2">Valor: {contrato.valor_pagamento}</h3>
						<h3 class="font-semibold mb-2">Datas</h3>
						<div class="mt-2 text-sm space-y-2">
							<p class="  rounded">
								Emissão: {contrato.date_emission
									? format(contrato.date_emission, 'dd/MM/yyyy')
									: '---'}
							</p>
							<p class="  rounded">
								Vencimento: {contrato.date_expire
									? format(contrato.date_expire, 'dd/MM/yyyy')
									: '---'}
							</p>
						</div>
					</div>
				</div>
			</div>-->
		</div>
	</div>
	<div class="mt-6 flex justify-center">
		<button on:click={generatePDF} class="btn btn-primary">
			<i class="fas fa-file-pdf mr-2"></i> Exportar para PDF
		</button>
	</div>
{/if}

<dialog id="my_modal_2" class="modal" bind:this={isOpenModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Pedido #{selectedPedido.id}</h3>
		<h3>Servico: {selectedServico.name}</h3>
		<h3>Descricão: {selectedPedido.description}</h3>
		<button
			on:click={() => isOpenModal?.close()}
			class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button
		>
		{#if selectedPedido.status === 'pendente'}
			<div class="flex gap-3 w-full justify-end">
				{#if data.fullUser.tipo === 'gerente'}
					<form
						method="POST"
						action="?/aceitarPedido"
						use:enhance={() => {
							setTimeout(() => {
								window.location.reload();
							}, 2000);
						}}
					>
						<div class="flex flex-col gap-3 mt-3 w-full">
							<input type="hidden" name="pedidoId" value={selectedPedido.id} />
							<button class="btn btn-success" type="submit">Aceitar pedido</button>
						</div>
					</form>
					<form
						method="POST"
						action="?/recusarPedido"
						use:enhance={() => {
							setTimeout(() => {
								window.location.reload();
							}, 2000);
						}}
					>
						<div class="flex flex-col gap-3 mt-3 w-full">
							<input type="hidden" name="pedidoId" value={selectedPedido.id} />
							<button class="btn btn-error" type="submit">Recusar pedido</button>
						</div>
					</form>
				{/if}
			</div>
		{/if}
	</div>
</dialog>
