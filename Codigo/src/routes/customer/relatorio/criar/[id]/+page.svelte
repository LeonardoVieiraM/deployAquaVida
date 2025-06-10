<script lang="ts">
	import type { PageData } from './$types';

	import { getUserContext } from '$lib/stores/user';
	import { applyAction, enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';

	const user = getUserContext();

	export let data: PageData;
	// let relatorios = data.relatorios;
	let contrato = data.contrato;
	let servicos = data.servicos;
	export let form;
	// let servicos = data.servicos;

	let relatorio = {
		nome: '',
		descricao: ''
	};
	let isLoading = false;

	const statuses = ['Em Andamento', 'Concluido', 'Não Iniciado', 'Pendente', 'Recusado'];
</script>
<div class="min-h-screen bg-gray-100 p-6">
	<div class="mb-2 mx-auto max-w-4xl">
		<Alert message={form?.message} success={form?.success}/>
	</div>
	<div class="max-w-4xl mx-auto bg-base-100 rounded-lg shadow p-6">
		{#if contrato}
			<div class="space-y-6">
				<div class="grid grid-cols-2 gap-6">
					<div>
						<label for="reportName" class="block text-sm font-medium ">
							Relatorio para o contrato:
						</label>
						<h1>{contrato.nome}</h1>
					</div>
				</div>
				<div class="w-full">
					{#if contrato?.servico}
						{#each contrato?.servico as servico}
							<form
								action="?/status"
								method="post"
								use:enhance={({ formData }) => {
									formData.set('status', String(servico.status));
									formData.set('contratoID',String(contrato.id))
								}}
							>
								<div class="flex items-center justify-between border-b py-2">
									<span class="text-sm font-medium">Serviço {servico.servico.name}</span>
									<div class="flex gap-2 items-center">
										<select name="" id="" bind:value={servico.status} class="select" >
											<option value={servico.status}>{servico.status}</option>
											{#each statuses as item}
												<option value={item}>{item}</option>
											{/each}
										</select>
										<button type="submit" class="btn btn-primary btn-sm">salvar</button>
									</div>
								</div>
							</form>
						{/each}
						<form
							method="post"
							action="?/solicitar"
							use:enhance={({ formData }) => {
								formData.set('clienteId', String(contrato.cliente_id));
							}}
						>
							<div class="flex justify-center items-center gap-4 mt-2">
								<label class="form-control w-full">
									<div class="label p-0 m-0">
										<!-- <span class="label-text">Recomende um serviço</span> -->
										<!-- <span class="label-text-alt">Alt label</span> -->
									</div>
									<select name="servico" class="select select-bordered">
										<option disabled selected>Escolha...</option>
										{#each servicos as servico}
											<option value={servico.id}>{servico.name}</option>
										{/each}
										<!-- <option value="outro">Outro</option> -->
									</select>
								</label>

								<button class="btn btn-primary" type="submit">Incluir serviço</button>

								<!-- {#if form?.message}
									<p class="text-error text-center mt-4">{form.message}</p>
								{/if} -->
							</div>
						</form>
					{/if}
				</div>
				<hr class="my-4" />
				<form
					action="?/create"
					method="post"
					class="flex flex-col"
					use:enhance={({ formData }) => {
						isLoading = true;
						formData.set('nome', String(relatorio.nome));
						formData.set('descricao', String(relatorio.descricao));
						formData.set('id', String(contrato.id));

						return async ({ result, update }) => {
							await update();
							isLoading = false;
							if (result.type === 'success') {
								console.log('Sucesso');
							} else {
								await applyAction(result);
							}
						};
					}}
				>
					<div>
						<label for="reportName" class="block text-sm font-medium ">
							Nome do relatório:
						</label>
						<!-- <h1>{relatorios.nome}</h1> -->
						<input
							type="text"
							placeholder="Nome"
							class="input input-bordered w-full max-w-md mt-2"
							bind:value={relatorio.nome}
						/>
					</div>
					<div>
						<label for="reportDescription" class="block text-sm font-medium mt-2">
							Descrição do relatório
						</label>
						<textarea
							bind:value={relatorio.descricao}
							class="textarea textarea-bordered w-full my-3"
							placeholder="Descricao do seu relatorio"
						></textarea>
						<button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
							{isLoading ? 'criando' : 'Salvar relatorio'}
						</button>
						<!-- {#if form?.success}
						<p class="text-success text-center mt-4">{form.message}</p>
					{/if} -->
					</div>
				</form>
				<!-- {#if form?.success}
					<p class="text-success text-center mt-4">{form.message}</p>
				{/if} -->
			</div>

			<hr class="my-5" />

			<div class="flex justify-end gap-4 mt-2">
				<a href="/customer/contratos/{contrato.cliente_id}" type="button" class="btn btn-primary">
					Voltar
				</a>
			</div>
		{/if}
	</div>
</div>
