<script lang="ts">
	import type { SelectCliente } from "$lib/server/db/schema";

export let clientes
</script>

{#if clientes}
	<h1 class="text-center text-2xl my-3">Seus clientes:</h1>
	<main class="mt-5">
		<section class="container px-4 mx-auto">
			<div class="flex justify-between">
				<div class="flex items-center gap-x-3">
					<h2 class="text-lg font-medium">Clientes</h2>

					<span class="px-3 py-1 text-xs bg-primary rounded-full text-primary-content"
						>{clientes.length}</span
					>
				</div>
			</div>

			{#if clientes.length === 0}
				<h1 class="text-xl text-center mt-16">Você ainda não possui nenhum cliente</h1>
			{:else}
				<div class="fle x flex-col mt-6">
					<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
							<div class="overflow-hidden border border-base-300 md:rounded-lg">
								<table class="min-w-full divide-y divide-base-300">
									<thead class=" bg-base-200">
										<tr>
											<th
												scope="col"
												class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-opacity-50"
											>
												<div class="flex items-center gap-x-3">
													<!-- <input type="checkbox" class="text-info-content border-base-300 rounded" /> -->
													<span>Nome</span>
												</div>
											</th>

											<th
												scope="col"
												class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-opacity-50"
											>
												<button class="flex items-center gap-x-2">
													<span>CNPJ</span>
												</button>
											</th>

											<th
												scope="col"
												class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-opacity-50"
											>
												<button class="flex items-center gap-x-2">
													<span>Email</span>
												</button>
											</th>

											<th
												scope="col"
												class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-opacity-50"
												>Endereço</th
											>
											<th></th>
										</tr>
									</thead>
									<tbody class="bg-base-200 bg-opacity-20 divide-y divide-base-300">
										{#each clientes as cliente}
											<tr>
												<td class="px-4 py-4 text-sm font-medium text-opacity-70 whitespace-nowrap">
													<div class="inline-flex items-center gap-x-3">
														<!-- <input type="checkbox" class="text-info-content border-base-300 rounded" /> -->

														<div class="flex items-center gap-x-2">
															<img
																class="object-cover w-10 h-10 rounded-full"
																src="https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
																alt="user"
															/>
															<div>
																<h2 class="font-medium">{cliente.name}</h2>
															</div>
														</div>
													</div>
												</td>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap"
													>{cliente.cnpj}</td
												>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap"
													>{cliente.email}</td
												>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap"
													>{cliente.endereco}</td
												>
												<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap"
													>
													<a href="/customer/contratos/{cliente.id}">Ver contratos</a></td
												>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</section>
	</main>
{:else}
	<h1 class="text-center mt-40 text-2xl">Você não é representante para acessar essa rota!</h1>
{/if}