<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { PageData } from './$types';
	import { format } from 'date-fns';
	import { DropletIcon } from 'lucide-svelte';

	export let data: PageData;
	export let form;

	let descricao = data.contrato.descricao || '';
	let valorPagamento = data.contrato.valor_pagamento || 0;
	let dataVencimento = data.contrato.date_expire;
	const today = new Date().toISOString().split('T')[0];
</script>

<div class="container mx-auto p-6">
	<h1 class="text-2xl font-bold mb-6">Editar Contrato #{data.contrato.id}</h1>

	<Alert message={form?.message} success={form?.success} />

	<div class="grid gap-6 lg:grid-cols-2">
		<form method="POST" action="?/update" use:enhance>
			<input type="hidden" name="contratoId" value={data.contrato.id} />

			<div class="space-y-4">
				<div class="form-control">
					<label class="label">
						<span class="label-text">Cliente</span>
					</label>
					<input
						type="text"
						class="input input-bordered w-full"
						value={data.contrato.cliente?.name || ''}
						disabled
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Representante</span>
					</label>
					<input
						type="text"
						class="input input-bordered w-full"
						value={data.contrato.cliente?.representante?.name || ''}
						disabled
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Valor do Pagamento (R$)*</span>
					</label>
					<input
						type="number"
						name="valorPagamento"
						bind:value={valorPagamento}
						class="input input-bordered w-full"
						step="0.01"
						min="0"
						required
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Data de Vencimento*</span>
					</label>
					<input
						type="date"
						name="dataVencimento"
						bind:value={dataVencimento}
						class="input input-bordered w-full"
						min={today}
						required
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Status do Pagamento</span>
					</label>
					<input
						type="text"
						class="input input-bordered w-full"
						value={data.contrato.status_pagamento}
						disabled
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Descrição</span>
					</label>
					<textarea name="descricao" bind:value={descricao} class="textarea textarea-bordered h-24"
					></textarea>
				</div>

				<button type="submit" class="btn btn-primary w-full"> Atualizar Contrato </button>
			</div>
		</form>

		<!-- Preview Contrato -->
		<div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
			<div class="text-center mb-8">
				<DropletIcon class="h-6 w-6" />
				<h2 class="text-2xl font-bold uppercase tracking-wide">
					Contrato de Prestação de Serviços
				</h2>
				<p class="text-gray-600 mt-1">Nº {data.contrato.id}</p>
			</div>

			<!-- Contratantes -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<div>
					<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">CONTRATANTE</h3>
					<p class="font-medium">{data.contrato.cliente?.name}</p>
					<p>Representante: {data.contrato.cliente?.representante?.name}</p>
					<p>Email: {data.contrato.cliente?.email}</p>
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
					{#if descricao}
						<p class="whitespace-pre-wrap">{descricao}</p>
					{:else}
						<p class="italic text-gray-500">Sem serviços específicos definidos</p>
					{/if}
				</div>
			</div>

			<!-- Valores e Datas -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<div>
					<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">VALORES</h3>
					<p><span class="font-medium">Total:</span> R$ {valorPagamento.toFixed(2)}</p>
					<p>
						<span class="font-medium">Status:</span>
						{#if data.contrato.status_pagamento === 'pago'}
							<span class="badge badge-success">Pago</span>
						{:else if data.contrato.status_pagamento === 'processando'}
							<span class="badge badge-warning">Processando</span>
						{:else}
							<span class="badge badge-error">Pendente</span>
						{/if}
					</p>
				</div>
				<div>
					<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">VIGÊNCIA</h3>
					<p>
						<span class="font-medium">Emissão:</span>
						{format(data.contrato.date_emission, 'dd/MM/yyyy')}
					</p>
					<p><span class="font-medium">Vencimento:</span> {format(dataVencimento, 'dd/MM/yyyy')}</p>
				</div>
			</div>

			<!-- Seção: Serviços Contratados 
			<div class="mb-8">
				<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">
					SERVIÇOS CONTRATADOS
				</h3>
				<ul class="list-disc pl-5 space-y-2">
					{#each data.contrato.servico as servico}
						<li class="flex justify-between">
							<span>{servico.servico.name}</span>
							<span
								class="badge {servico.status === 'Pendente'
									? 'badge-error'
									: servico.status === 'Concluído'
										? 'badge-success'
										: 'badge-warning'}"
							>
								{servico.status}
							</span>
						</li>
					{/each}
				</ul>
			</div>-->

			<!-- Relatórios -->
			{#if data.contrato.relatorio && data.contrato.relatorio.length > 0}
				<div class="mb-8">
					<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">RELATÓRIOS</h3>
					<div class="space-y-4">
						{#each data.contrato.relatorio as relatorio}
							<div class="bg-gray-50 p-4 rounded border border-gray-200">
								<p class="font-medium text-gray-800">{relatorio.titulo}</p>
								<p class="mt-2 text-gray-700">{relatorio.descricao}</p>
								<p class="mt-1 text-sm text-gray-500">
									{format(relatorio.created_at, 'dd/MM/yyyy HH:mm')}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}

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

		<!--<div class="p-6 bg-base-200 rounded-lg">
			<div class="space-y-4">
				<h2 class="text-xl font-semibold">Detalhes do Contrato</h2>
				<div class="space-y-2">
					<p><strong>ID:</strong> {data.contrato.id}</p>
					<p><strong>Cliente:</strong> {data.contrato.cliente?.name}</p>
					<p><strong>Representante:</strong> {data.contrato.cliente?.representante?.name}</p>
					<p><strong>Valor:</strong> R$ {valorPagamento.toFixed(2)}</p>
					<p>
						<strong>Status Pagamento:</strong>
						{#if data.contrato.status_pagamento === 'pago'}
							<span class="badge badge-success">Pago</span>
						{:else if data.contrato.status_pagamento === 'processando'}
							<span class="badge badge-warning">Processando</span>
						{:else}
							<span class="badge badge-error">Pendente</span>
						{/if}
					</p>
					<p><strong>Emissão:</strong> {format(data.contrato.date_emission, 'dd/MM/yyyy')}</p>
					<p><strong>Vencimento:</strong> {format(dataVencimento, 'dd/MM/yyyy')}</p>
				</div>

				{#if descricao}
					<div class="mt-4">
						<h3 class="font-medium">Descrição:</h3>
						<p class="whitespace-pre-wrap">{descricao}</p>
					</div>
				{/if}

				{#if data.contrato.relatorio}
					<div class="mt-4">
						<h3 class="font-medium">Relatórios:</h3>
						<div class="space-y-2">
							{#each data.contrato.relatorio as relatorio}
								<div class="p-2 bg-base-100 rounded">
									<p>{relatorio.descricao}</p>
									<p class="text-sm text-gray-500">
										{format(relatorio.created_at, 'dd/MM/yyyy HH:mm')}
									</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>-->
	</div>
</div>
