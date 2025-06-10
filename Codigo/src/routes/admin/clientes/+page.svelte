<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	// import ClienteModal from '$lib/components/modal/ClienteModal.svelte';
	import type { SelectCliente } from '$lib/server/db/schema';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form;

	let clientes = data.clientes;
	let isOpenModal: HTMLDialogElement | null = null;
	let isOpenModalUpdate: HTMLDialogElement | null = null;
	let representantes = data.representantes;

	let selectedCliente: SelectCliente = {
		id: 1,
		name: '',
		cnpj: '',
		endereco: '',
		email: '',
		representante_id: 1
	};

	function openEditModal(cliente: SelectCliente) {
		selectedCliente = { ...cliente };
		isOpenModalUpdate?.showModal();
	}

	function setupModalClose() {
		const handleClickOutside = (event: MouseEvent) => {
			if (isOpenModalUpdate && event.target === isOpenModalUpdate) {
				isOpenModalUpdate.close();
			}
		};

		// Adiciona o event listener quando o componente é montado
		onMount(() => {
			document.addEventListener('click', handleClickOutside);

			// Remove o event listener quando o componente é desmontado
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		});
	}

	// Inicializa o fechamento do modal
	setupModalClose();

	//TODO: No edit do cliente poder colocar um representante
</script>

<main class="mt-5">
	<section class="container px-4 mx-auto">
		<div class="flex justify-between">
			<div class="flex items-center gap-x-3">
				<h2 class="text-lg font-medium">Clientes</h2>

				<span class="px-3 py-1 text-xs bg-primary rounded-full text-primary-content"
					>{clientes.length}</span
				>
			</div>
			<button class="btn btn-primary" on:click={() => isOpenModal?.showModal()}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-user-plus"
					><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line
						x1="19"
						x2="19"
						y1="8"
						y2="14"
					/><line x1="22" x2="16" y1="11" y2="11" /></svg
				> Criar Cliente</button
			>
		</div>

		{#if clientes.length === 0}
			<h1 class="text-xl text-center mt-16">
				Nenhum cliente cadastrado <button
					class="underline text-primary"
					on:click={() => isOpenModal?.showModal()}>clique aqui</button
				> para criar um cliente
			</h1>
		{:else}
			<Alert message={form?.message} success={form?.success} />
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

										<th
											scope="col"
											class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-opacity-50"
											>Representante</th
										>

										<th scope="col" class="relative py-3.5 px-4">
											<span class="sr-only">Edit</span>
										</th>
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
											<td class="px-4 py-4 text-sm text-opacity-50 whitespace-nowrap">
												{#if representantes}
													{representantes.find((rep) => rep.id === cliente.representante_id)
														?.name || 'Sem representante'}
												{/if}
											</td>
											<td class="px-4 py-4 text-sm whitespace-nowrap">
												<div class="flex items-center gap-x-6">
													<form method="POST" action="?/delete" class="m-0 p-0">
														<input type="hidden" name="id" value={cliente.id} />
														<button
															title="Deletar cliente"
															class="text-opacity-50 transition-colors duration-200 hover:text-error focus:outline-none tooltip"
															data-tip="Deletar cliente"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																class="w-5 h-5"
															>
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
																/>
															</svg>
														</button>
													</form>

													<button
														on:click={() => openEditModal(cliente)}
														title="Editar dados do cliente"
														class="text-opacity-50 transition-colors duration-200 hover:text-primary focus:outline-none mb-2 tooltip"
														data-tip="Editar dados do cliente"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="w-5 h-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
															/>
														</svg>
													</button>

													<a
														title="Visualizar contratos do cliente"
														class="text-opacity-50 transition-colors duration-200 hover:text-primary focus:outline-none mb-2 tooltip"
														data-tip="Visualizar contratos do cliente"
														href="/customer/contratos/{cliente.id}"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="w-5 h-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M3 8.25V6.75A2.25 2.25 0 015.25 4.5h8.5A2.25 2.25 0 0116 6.75v8.5a2.25 2.25 0 01-2.25 2.25h-8.5A2.25 2.25 0 013 15.25v-1.5M9 13.5l6-6M15 9.5H12.5A2.25 2.25 0 0110.25 11.5V14"
															/>
														</svg>
													</a>
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
	</section>
</main>

<dialog id="my_modal_2" class="modal" bind:this={isOpenModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Criar um cliente</h3>
		<button
			on:click={() => isOpenModal?.close()}
			class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button
		>
		<!-- <ClienteModal /> -->

		<form method="POST" action="?/create">
			<div class="flex flex-col gap-3 mt-3">
				<label class="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
						/>
					</svg>
					<input type="text" class="grow" placeholder="Name" name="name" />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<input type="text" class="grow" placeholder="Cnpj" name="cnpj" />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
						/>
						<path
							d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
						/>
					</svg>
					<input type="email" class="grow" placeholder="Email" name="email" />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<input
						type="text"
						class="grow"
						placeholder="Endereco"
						name="endereco"
						value={selectedCliente.endereco}
					/>
				</label>
				<select class="select select-bordered w-full" name="representante_id">
					<option disabled selected>Selecione o representante</option>
					{#each representantes as representate}
						<option value={representate.id}>{representate.name}</option>
					{/each}
				</select>
				<button class="btn btn-info" type="submit">Criar cliente</button>
			</div>
		</form>
	</div>
</dialog>

<dialog id="my_modal_2" class="modal" bind:this={isOpenModalUpdate}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Atualizar {selectedCliente.name}</h3>
		<!-- <ClienteModal /> -->

		<form method="POST" action="?/update">
			<input type="hidden" name="id" value={selectedCliente.id} />
			<div class="flex flex-col gap-3 mt-3">
				<label class="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
						/>
					</svg>
					<input
						type="text"
						class="grow"
						placeholder="Name"
						name="name"
						value={selectedCliente.name}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<input
						type="text"
						class="grow"
						placeholder="Cnpj"
						name="cnpj"
						value={selectedCliente.cnpj}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
						/>
						<path
							d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
						/>
					</svg>
					<input
						type="email"
						class="grow"
						placeholder="Email"
						name="email"
						value={selectedCliente.email}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<input
						type="text"
						class="grow"
						placeholder="Endereco"
						name="endereco"
						value={selectedCliente.endereco}
					/>
				</label>
				<!-- Select para atualizar representante -->
				<select
					class="select select-bordered w-full"
					name="representante_id"
					bind:value={selectedCliente.representante_id}
				>
					<option disabled selected>Selecione o representante</option>
					{#each representantes as representante}
						<option value={representante.id}>{representante.name}</option>
					{/each}
				</select>
				<button class="btn btn-info" type="submit">Atualizar cliente</button>
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

