<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import type { SelectTemplate } from '$lib/server/db/schema';
	import type { PageData } from './$types';

	export let data: PageData;

	let isOpenModal: HTMLDialogElement | null = null;

	let templates = data.templates;
	let servicos = data.servicos;

	let descricao = '';

	let simbolo = ' {&} ';

	export let form;

	function appendSimbolo() {
		descricao = descricao.concat(simbolo);
	}

	let selectedTemplate: SelectTemplate = {
		servico_id: 1,
		descricao: ''
	};
	$: console.log(selectedTemplate);

	function openEditModal(template: SelectTemplate) {
		selectedTemplate = { ...template };
		isOpenModalUpdate?.showModal();
	}

	let isOpenModalUpdate: HTMLDialogElement | null = null;
</script>

<main class="container mx-auto">
	<Alert message={form?.message} success={form?.success} />
	<div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
		{#each templates as template}
			<div class="card bg-base-100 image-full md:max-w-96 w-full shadow-xl">
				<!-- <figure>
					<img
					src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
					alt="Shoes"
					/>
					</figure> -->
				<div class="card-body">
					<h2 class="card-title">Serviço: {template.servico?.name}</h2>
					<p>Template: {template.template.descricao}</p>
					<div class="card-actions justify-end">
						<button
							class="btn btn-primary"
							on:click={() => {
								openEditModal(template.template);
							}}>Editar</button
						>
					</div>
				</div>
			</div>
		{/each}
		<button on:click={() => isOpenModal?.showModal()} class="btn btn-primary h-full"
			>Novo template<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg
			></button
		>
	</div>
	<!-- {#if form?.message}
					<p class="text-error text-center mt-4">{form.message}</p>
				{/if} -->
</main>

<dialog id="my_modal_2" class="modal" bind:this={isOpenModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Criar um template de um servico</h3>
		<button
			on:click={() => isOpenModal?.close()}
			class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button
		>
		<!-- <servicosModal /> -->

		<form action="?/create" method="post" class="w-full flex flex-col gap-2 mt-2">
			<select class="select select-bordered w-full" name="servico_id">
				<option disabled selected>Selecione o servico</option>
				{#each servicos as servico}
					<option value={servico.id}>{servico.name}</option>
				{/each}
			</select>
			<textarea
				class="textarea textarea-bordered"
				name="description"
				placeholder="Bio"
				bind:value={descricao}
			></textarea>
			<div class="flex flex-col gap-2">
				<button type="button" class="btn btn-primary" on:click={appendSimbolo}
					>Adicionar espaço para variavel</button
				>
				<button class="btn btn-info" type="submit">criar</button>
			</div>
			<!-- {#if form?.message}
					<p class="text-error text-center mt-4">{form.message}</p>
				{/if} -->
		</form>

		<!-- <div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div> -->
	</div>
</dialog>

<dialog id="my_modal_2" class="modal" bind:this={isOpenModalUpdate}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Atualizar {selectedTemplate.servico_id}</h3>
		<!-- <ClienteModal /> -->

		<form method="POST" action="?/update">
			<input type="hidden" name="servico_id" value={selectedTemplate.servico_id} />
			<div class="flex flex-col gap-3 mt-3">
				<textarea
					class="textarea textarea-bordered"
					name="description"
					placeholder="Bio"
					value={selectedTemplate.descricao}
				></textarea>
				<button
					type="button"
					class="btn btn-primary"
					on:click={() => {
						selectedTemplate.descricao = selectedTemplate.descricao?.concat(simbolo);
					}}>Adicionar espaço para variavel</button
				>
				<button class="btn btn-info" type="submit">Atualizar template</button>
			</div>
		</form>

		<!-- <div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div> -->
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>fechar</button>
	</form>
</dialog>
