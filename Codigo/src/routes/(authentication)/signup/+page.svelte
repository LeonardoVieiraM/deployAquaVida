<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { getEnderecoFromCEP } from '$lib/utils/utils';

	export let form;

	let isCliente = false;
	let isRepresentante = false;
	let isGerente = false;
	let isLoading = false;

	let formEndereco = {
		number: '',
		cep: '',
		street: '',
		complement: '',
		neighborhood: '',
		city: '',
		state: ''
	};

	async function handleCep(cep: string) {
		const responseapi = await getEnderecoFromCEP(cep);
		if (responseapi.bairro) {
			formEndereco.neighborhood = responseapi.bairro;
		}
		if (responseapi.logradouro) {
			formEndereco.street = responseapi.logradouro;
		}
		if (responseapi.uf) {
			formEndereco.state = responseapi.uf;
		}
		if (responseapi.localidade) {
			formEndereco.city = responseapi.localidade;
		}
		console.log(responseapi);
	}
</script>

<div class="min-h-[90vh] flex items-center justify-center">
	<div class="w-full max-w-sm mx-auto overflow-hidden bg-base-200 rounded-lg shadow-md">
		<div class="px-6 py-4">
			{#if isCliente || isRepresentante || isGerente}
				<div class="flex justify-center">
					<div class="badge badge-primary">
						<button
							class="flex justify-center gap-1 items-center"
							on:click={() => {
								isCliente = false;
								isRepresentante = false;
								isGerente = false;
							}}
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-undo-2"
								><path d="M9 14 4 9l5-5" /><path
									d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"
								/></svg
							> Voltar</button
						>
					</div>
				</div>
			{/if}
			{#if isRepresentante}
				<h3 class="mt-3 text-xl font-medium text-center text-opacity-60">Criar sua conta!</h3>
				<form
					method="post"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							isLoading = false;
							update();
						};
					}}
				>
					<input type="hidden" name="isCliente" value={isCliente} />
					<div class="w-full mt-4">
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
							<input type="text" class="grow" placeholder="Username" name="username" />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="text" class="grow" placeholder="Email" name="email" />
						</label>
					</div>

					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="text" class="grow" placeholder="CPF" name="cpf" />
						</label>
					</div>

					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="password" class="grow" placeholder="Password" name="password" />
						</label>
					</div>

					<button class="btn btn-primary w-full mt-4" disabled={isLoading}
						>{isLoading ? 'Registrando...' : 'Registrar'}</button
					>

					{#if form?.message}
						<p class="text-error text-center">{form.message}</p>
					{/if}
				</form>
			{:else if isGerente}
				<h3 class="mt-3 text-xl font-medium text-center text-opacity-60">
					Criar sua conta de Gerente!
				</h3>
				<form
					method="post"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							isLoading = false;
							update();
						};
					}}
				>
					<input type="hidden" name="isCliente" value={isCliente} />
					<input type="hidden" name="isGerente" value={isGerente} />
					<div class="w-full mt-4">
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
							<input type="text" class="grow" placeholder="Username" name="username" required />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="email" class="grow" placeholder="Email" name="email" required />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="password" class="grow" placeholder="Password" name="password" required />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								placeholder="Estado (ex: SP)"
								name="estado"
								required
							/>
						</label>
					</div>

					<!-- Novo campo para senha de validação -->
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-key-round"
							>
								<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
								<circle cx="16.5" cy="7.5" r=".5" />
							</svg>
							<input
								type="password"
								class="grow"
								placeholder="Senha para validar cadastro"
								name="adminPassword"
								required
							/>
						</label>
					</div>

					<button class="btn btn-primary w-full mt-4" disabled={isLoading}>
						{isLoading ? 'Registrando...' : 'Registrar'}
					</button>

					{#if form?.message}
						<p class="text-error text-center">{form.message}</p>
					{/if}
				</form>
			{:else if isCliente}
				<h3 class="mt-3 text-xl font-medium text-center text-opacity-60">
					Criar sua conta de Cliente!
				</h3>
				<form
					method="post"
					use:enhance={() => {
						isLoading = true;
						return async ({ update }) => {
							isLoading = false;
							update();
						};
					}}
				>
					<input type="hidden" name="isCliente" value={isCliente} />
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="text" class="grow" placeholder="Username" name="username" />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="text" class="grow" placeholder="Email" name="email" />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="password" class="grow" placeholder="Password" name="password" />
						</label>
					</div>
					<div class="w-full mt-4">
						<label class="input input-bordered flex items-center gap-2">
							<input type="text" class="grow" placeholder="CNPJ" name="cpf" />
						</label>
					</div>
					<div class="w-full mt-4 grid grid-cols-2 gap-2">
						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								name="cep"
								placeholder="CEP"
								on:change={async (e) => {
									const value = e.target?.value;
									if (value.length === 8) {
										await handleCep(value);
									}
									console.log(value);
								}}
								bind:value={formEndereco.cep}
							/>
						</label>
						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								placeholder="Rua"
								bind:value={formEndereco.street}
								name="street"
							/>
						</label>
					</div>
					<div class="w-full mt-4 grid grid-cols-2 gap-2">
						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								placeholder="Bairro"
								bind:value={formEndereco.neighborhood}
								name="bairro"
							/>
						</label>
						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								placeholder="Cidade"
								bind:value={formEndereco.city}
								name="city"
							/>
						</label>
					</div>
					<div class="w-full mt-4 grid grid-cols-2 gap-2">
						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								placeholder="Estado"
								bind:value={formEndereco.state}
								name="state"
							/>
						</label>

						<label class="input input-bordered flex items-center gap-2">
							<input
								type="text"
								class="grow"
								placeholder="Número"
								bind:value={formEndereco.number}
								name="number"
							/>
						</label>
					</div>

					<button class="btn btn-primary w-full mt-4" disabled={isLoading}
						>{isLoading ? 'Registrando...' : 'Registrar'}</button
					>

					{#if form?.message}
						<p class="text-error text-center">{form.message}</p>
					{/if}
				</form>
			{:else}
				<h3 class="mt-3 text-xl font-medium text-center text-opacity-60">
					Qual seu tipo de usuário?
				</h3>
				<div class="flex flex-col gap-2 mt-3">
					<button class="btn btn-primary w-full" on:click={() => (isCliente = !isCliente)}
						>Cliente</button
					>
					<button
						class="btn btn-primary w-full"
						on:click={() => (isRepresentante = !isRepresentante)}>Representante</button
					>
					<button class="btn btn-primary w-full" on:click={() => (isGerente = !isGerente)}
						>Gerente</button
					>
				</div>
			{/if}
		</div>
		<div class="flex items-center justify-center py-4 text-center bg-base-300 bg-opacity-40">
			<span class="text-sm text-opacity-60">Já tem uma conta? </span>

			<a href="/login" class="mx-2 text-sm font-bold text-primary hover:underline">Login</a>
		</div>
	</div>
</div>
