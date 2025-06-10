<script lang="ts">
	import NoResults from '$lib/components/NoResults.svelte';
	import type { PageData } from './$types';
	import {
		TableHandler,
		Datatable,
		ThSort,
		ThFilter,
		Th,
		Pagination,
		RowsPerPage
	} from '@vincjo/datatables';

	export let data: PageData;
	const table = new TableHandler(data.servicos, { rowsPerPage: 10 });
	let servicos = data.servicos;
</script>

<div class="container mx-auto py-8">
	<h1 class="text-4xl font-bold mb-6 text-center">Nossos Serviços</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each servicos as servico (servico.id)}
			<div class="bg-base-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
				<h2 class="text-2xl font-semibold mb-2">{servico.name}</h2>
				<p class="">{servico.description}</p>
			</div>
		{/each}
	</div>
</div>
<!-- <main class="container mx-auto h-full max-h-[calc(100vh-20vh)] mt-10">
	<Datatable basic {table} headless>
		{#snippet header()}{/snippet}
		<table class="table table-zebra border rounded-lg">
			<thead>
				<tr>
					<ThSort {table} field="id">ID</ThSort>
					<ThSort {table} field="name">Serviço</ThSort>
					<ThSort {table} field="description">Descrição</ThSort>
				</tr>
				<tr>
					<Th />
					<ThFilter {table} field="name" />
					<ThFilter {table} field="description" />
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row}
					<tr>
						<td>{row.id}</td>
						<td>{row.name}</td>
						<td>{row.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if table.rows.length === 0}
			<NoResults type={'serviço'} />
		{/if}
		{#snippet footer()}
			<RowsPerPage {table} />
			<div></div>
			<Pagination {table} />
		{/snippet}
	</Datatable>
</main> -->
