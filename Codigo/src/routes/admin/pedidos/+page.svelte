<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SelectPedido } from '$lib/server/db/schema/cliente';
	import type { PageData } from './$types';

	export let data: PageData;

	let pedidos = data.pedidos;

	let pedidosPendentes = pedidos.filter(pedido => pedido.pedidos.status === 'pendente');
	let pedidosAceitos = pedidos.filter(pedido => pedido.pedidos.status === 'aderido');
	let pedidosRecusados = pedidos.filter(pedido => pedido.pedidos.status === 'recusado');
	//TODO: solicitar varios pedidos e ter tabela de pedidos com botão
</script>

<main class="mt-5">
	<section class="container px-4 mx-auto">
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-x-3">
				<h2 class="text-lg font-medium">Pedidos</h2>
				<span class="px-3 py-1 text-xs bg-primary rounded-full text-primary-content">
					{pedidos.length}
				</span>
			</div>
		</div>

		{#if pedidos.length === 0}
			<h1 class="text-xl text-center mt-16">Nenhum pedido encontrado.</h1>
		{:else}
			<!-- Pedidos Pendentes -->
			<h3 class="mt-6 text-lg font-semibold">Pedidos Pendentes</h3>
			{#if pedidosPendentes.length === 0}
				<p class="mt-4">Nenhum pedido pendente.</p>
			{:else}
				<div class="flex flex-col mt-4">
					<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div class="overflow-hidden border border-base-300 md:rounded-lg">
								<table class="min-w-full divide-y divide-base-300">
									<thead class="bg-base-200">
										<tr>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Pedido
											</th>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Cliente
											</th>
											<th scope="col" class="px-4 py-3.5 text-sm font-normal text-left">
												Descrição
											</th>
											<th scope="col" class="px-4 py-3.5 text-sm font-normal text-left">
												Serviço
											</th>
											
											<th scope="col" class="relative py-3.5 px-4">
												<span class="sr-only">Ações</span>
											</th>
										</tr>
									</thead>
									<tbody class="bg-base-200 bg-opacity-20 divide-y divide-base-300">
										{#each pedidosPendentes as pedido}
											<tr>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													{pedido.pedidos.id}
												</td>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													{pedido.cliente?.name}
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
													{pedido.pedidos.description}
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
													{pedido.servico?.name}
												</td>
												
												<td class="px-4 py-4 text-sm whitespace-nowrap">
													<div class="flex items-center gap-x-6">
														<form method="POST" action="?/aceitarPedido" use:enhance={()=>{
															setTimeout(()=>{
																window.location.reload()
															},2000)
															}}>
															<input type="hidden" name="pedidoId" value={pedido.pedidos.id} />
															<button class="btn btn-primary text-white">Aceitar</button>
														</form>

														<form method="POST" action="?/recusarPedido" use:enhance={()=>{
															setTimeout(()=>{
																window.location.reload()
															},2000)
															}}>
															<input type="hidden" name="pedidoId" value={pedido.pedidos.id} />
															<button class="btn btn-error text-white">Recusar</button>
														</form>
													</div>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Pedidos Aceitos -->
			<h3 class="mt-6 text-lg font-semibold">Pedidos Aceitos</h3>
			{#if pedidosAceitos.length === 0}
				<p class="mt-4">Nenhum pedido aceito.</p>
			{:else}
				<div class="flex flex-col mt-4">
					<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div class="overflow-hidden border border-base-300 md:rounded-lg">
								<table class="min-w-full divide-y divide-base-300">
									<thead class="bg-base-200">
										<tr>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Pedido
											</th>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Cliente
											</th>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Descrição
											</th>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Serviço
											</th>
											
										</tr>
									</thead>
									<tbody class="bg-base-200 bg-opacity-20 divide-y divide-base-300">
										{#each pedidosAceitos as pedido}
											<tr>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													{pedido.pedidos.id}
												</td>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													{pedido.cliente?.name}
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
													{pedido.pedidos.description}
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
													{pedido.servico?.name}
												</td>
												
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Pedidos Recusados -->
			<h3 class="mt-6 text-lg font-semibold">Pedidos Recusados</h3>
			{#if pedidosRecusados.length === 0}
				<p class="mt-4">Nenhum pedido recusado.</p>
			{:else}
				<div class="flex flex-col mt-4">
					<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div class="overflow-hidden border border-base-300 md:rounded-lg">
								<table class="min-w-full divide-y divide-base-300">
									<thead class="bg-base-200">
										<tr>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Pedido
											</th>
											<th scope="col" class="py-3.5 px-4 text-sm font-normal text-left">
												Cliente
											</th>
											<th scope="col" class="px-4 py-3.5 text-sm font-normal text-left">
												Descrição
											</th>
											<th scope="col" class="px-4 py-3.5 text-sm font-normal text-left">
												Serviço
											</th>
											
										</tr>
									</thead>
									<tbody class="bg-base-200 bg-opacity-20 divide-y divide-base-300">
										{#each pedidosRecusados as pedido}
											<tr>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													{pedido.pedidos.id}
												</td>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													{pedido.cliente?.name}
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
													{pedido.pedidos.description}
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
													{pedido.servico?.name}
												</td>
												
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</section>
</main>
