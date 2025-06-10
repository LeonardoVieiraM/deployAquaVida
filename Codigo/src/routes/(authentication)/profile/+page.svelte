<script lang="ts">
	import { getUserContext } from '$lib/stores/user';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	const user = getUserContext();

	export let data: PageData;

	let isOpenModal: HTMLDialogElement | null = null;
</script>

<div
	class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-28 bg-base shadow-xl rounded-lg"
>
	<div class="rounded-t-lg h-32 overflow-hidden">
		<img
			class="object-cover object-top w-full"
			src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
			alt="Mountain"
		/>
	</div>
	<div
		class="mx-auto w-32 h-32 relative -mt-16 border-4 border-base-300 rounded-full overflow-hidden"
	>
		<img
			class="object-cover object-center h-32"
			src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
			alt="Woman looking front"
		/>
	</div>
	<div class="text-center mt-2">
		<h2 class="font-semibold">{$user?.username}</h2>
		<p class="text-opacity-60">{$user?.email}</p>
		{#if data.cliente}
			{#if !data.cliente[0].representante}
				Representante ainda não cadastrado
			{:else}
				Representante: <p class="text-opacity-60">{data.cliente[0].representante?.name}</p>
				Email do representante:
				<p class="text-opacity-60">{data.cliente[0].representante?.email ?? 'Ainda não cadastrou'}</p>
			{/if}
		{/if}
	</div>
	<div class="mx-2 p-4 border-t border-base-300 mt-2 flex gap-2 justify-center">
		<form method="post" use:enhance action="?/logout">
			<button class="btn btn-secondary">Logout</button>
		</form>
		<button class="btn btn-primary" on:click={() => isOpenModal?.showModal()}
			>Editar informações</button
		>
	</div>
</div>

<dialog id="my_modal_2" class="modal" bind:this={isOpenModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Atualizar {$user?.username}</h3>
		<!-- <ClienteModal /> -->

		<form method="POST" action="?/update">
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
					<input type="text" class="grow" placeholder="Name" name="name" value={$user?.username} />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<input type="text" class="grow" placeholder="Cnpj" name="cnpj" value={$user?.email} />
				</label>
				<button class="btn btn-primary" type="submit">Atualizar perfil</button>
			</div>
		</form>

		<!-- <div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
		</div> -->
	</div>
</dialog>
