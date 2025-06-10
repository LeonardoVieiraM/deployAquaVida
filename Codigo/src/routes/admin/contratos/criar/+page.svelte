<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import { DropletIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { format } from 'date-fns';

	export let data: PageData;
	export let form;

	let descricao = '';

	const parts = descricao.split(/{&}/);
	let inputValues = Array(parts.length - 1).fill('');
	let valorPagamento = 0;
	$: contratoNome = '';

	let clienteNome = '';
	let clienteId = '';
	let clienteEmail = '';

	$: console.log(clienteId);

	let representanteNome = '';
	let representanteId = 0;

	let servicoId = 0;

	let servicosIds: number[] = [];

	let dataVencimento = new Date();
	let dataEmissao = new Date();

	let clientes = data.clientes;
	let representantes = data.representantes;
	let templates = data.templates;

	$: if (clienteId && clientes) {
		const selectedCliente = clientes.find((c) => c.id === Number(clienteId));
		if (selectedCliente) {
			clienteNome = selectedCliente.name;
			clienteEmail = selectedCliente.email || 'Email não disponível';
		}
	}

	$: console.log(representanteId);

	function adicionar() {
		const selectedTemplate = templates.find(
			(template) => template.template.servico_id === servicoId
		);
		if (selectedTemplate?.servico) {
			servicosIds.push(selectedTemplate?.servico?.id);
		}
		console.log(servicosIds);
		if (selectedTemplate) {
			descricao += selectedTemplate.template.descricao + '<br><br>';
			parts.length = 0;
			inputValues.length = 0;
			parts.push(...descricao.split(/{&}/));
			inputValues = Array(parts.length - 1).fill('');
		}
	}

	function updateDescricao() {
		let updatedDescricao = parts[0];
		inputValues.forEach((value, index) => {
			updatedDescricao += value + parts[index + 1];
		});
		descricao = updatedDescricao;
	}
	const today = new Date().toISOString().split('T')[0];
</script>

<div class="container mx-auto p-6">
	<Alert message={form?.message} success={form?.success} />
	<div class="grid gap-6 lg:grid-cols-2">
		<form
			method="POST"
			action="?/create"
			use:enhance={({ formData }) => {
				formData.set('descricao', descricao);
				formData.set('cliente_id', clienteId);
				formData.set('valorPagamento', valorPagamento.toString()); // Add this line
				formData.set('dataVencimento', String(dataVencimento));
				servicosIds.forEach((id) => {
					formData.append('servicosIds', String(id));
				});
			}}
		>
			<div>
				<div class="w-full">
					<label for="contratoNome" class="label">Nome do contrato</label>
					<input
						id="contratoNome"
						type="text"
						name="contratoNome"
						placeholder="Nome do contrato"
						bind:value={contratoNome}
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="w-full">
					<label for="clientName" class="label">Nome do Cliente</label>
					<select
						id="clientName"
						bind:value={clienteId}
						class="select select-bordered w-full"
						required
					>
						<option value="" selected>Selecione o cliente</option>
						{#each clientes as cliente}
							<option value={cliente.id}>{cliente.name}</option>
						{/each}
					</select>
				</div>

				<!-- Add the payment value field -->
				<div class="w-full">
					<label for="valorPagamento" class="label">Valor do Contrato (R$)</label>
					<input
						id="valorPagamento"
						type="number"
						name="valorPagamento"
						bind:value={valorPagamento}
						class="input input-bordered w-full"
						step="0.01"
						min="0"
						required
						placeholder="0,00"
					/>
				</div>

				<div class="w-full">
					<label for="dataVencimento" class="label">Data Vencimento</label>
					<input
						id="dataVencimento"
						name="dataVencimento"
						type="date"
						bind:value={dataVencimento}
						class="input input-bordered w-full"
						min={today}
						required
					/>
				</div>

				<div class=" w-full flex gap-2 items-end mb-4">
					<div class="w-full">
						<label for="service" class="label">Serviço</label>
						<select id="service" class="select select-bordered w-full" bind:value={servicoId}>
							<option value="" selected disabled>Selecione o serviço</option>
							{#each templates as servico}
								<option value={servico.template.servico_id}>{servico.servico?.name}</option>
							{/each}
						</select>
					</div>
					<button type="button" class="btn btn-primary" on:click={adicionar}> Adicionar </button>
				</div>
			</div>

			<div class="flex gap-4">
				<button type="submit" class="btn btn-primary w-full"> Criar Contrato </button>
			</div>
		</form>

		<div class="p-6 bg-base-200 rounded-lg">
			<div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
				<div class="text-center mb-8">
					<DropletIcon class="h-6 w-6 mx-auto mb-2 text-primary" />
					<h2 class="text-2xl font-bold uppercase tracking-wide">
						Contrato de Prestação de Serviços
					</h2>
					<p class="text-gray-600 mt-1">Nº (Novo)</p>
				</div>

				<!-- Contratantes -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					<div>
						<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">CONTRATANTE</h3>
						<p class="font-medium">{clienteNome || 'Nome do cliente'}</p>
						<p>Representante: {representanteNome || 'Nome do representante'}</p>
						<p>Email: {clienteEmail || 'Email do cliente'}</p>
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
							<div class="variable-inputs">
								{#each parts as part, index}
									<span class="inline-block">{@html part}</span>
									{#if index < inputValues.length}
										<input
											type="text"
											bind:value={inputValues[index]}
											class="input input-xs border-b border-gray-400 mx-1 w-24 inline-block"
											on:input={updateDescricao}
											placeholder="valor"
										/>
									{/if}
								{/each}
							</div>
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
							<span class="badge badge-error">Pendente</span>
						</p>
					</div>
					<div>
						<h3 class="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">VIGÊNCIA</h3>
						<p>
							<span class="font-medium">Emissão:</span>
							{format(dataEmissao, 'dd/MM/yyyy')}
						</p>
						<p>
							<span class="font-medium">Vencimento:</span>
							{format(dataVencimento, 'dd/MM/yyyy')}
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

		<!--<div class="p-6 bg-base-200 rounded-lg">
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">{contratoNome || 'Nome do contrato'}</h2>
				<div class=" w-full text-sm">
					<p>{clienteNome || 'Nome do cliente'}</p>
					<p>{representanteNome || 'Nome do representante'}</p>
					<p>Valor: R$ {valorPagamento.toFixed(2)}</p>
				</div>
				<p class="text-sm">
					{#each parts as part, index}
						{#if index < inputValues.length}
							{@html part}
							<input
								type="text"
								bind:value={inputValues[index]}
								class="w-6"
								on:input={updateDescricao}
							/>
						{:else}
							{@html part}
						{/if}
					{/each}
				</p>
				<div class="pt-4 border-t border-base-300">
					<h3 class="font-semibold">Datas</h3>
					<div class="mt-2 text-sm">
						<p>Emissão: {format(dataEmissao, 'dd/MM/yyyy') || '---'}</p>
						<p>Vencimento: {format(dataVencimento, 'dd/MM/yyyy') || '---'}</p>
					</div>
				</div>
			</div>
		</div>-->
	</div>
</div>

<style>
	.variable-inputs input {
		display: inline-block;
		min-width: 80px;
		text-align: center;
		padding: 2px 4px;
		margin: 0 4px;
		border-bottom: 1px dashed #4b5563;
		background-color: #f9fafb;
	}
</style>
