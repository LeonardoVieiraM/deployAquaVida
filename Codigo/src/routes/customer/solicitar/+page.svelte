<script lang="ts">
	import type { PageData } from './$types';

	import { getUserContext } from '$lib/stores/user';
	import Alert from '$lib/components/Alert.svelte';

	const user = getUserContext();

	export let data: PageData;
	export let form;

	let servicos = data.servicos;
</script>

<h1 class="text-center mt-4 text-2xl font-semibold">Solicitar serviços</h1>
<form method="post" action="?/solicitar">
	<div class="flex flex-col justify-center items-center max-w-xl mx-auto mt-5">
		<Alert message={form?.message} success={form?.success}/>
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">Selecione um serviço</span>
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

		<label class="form-control w-full mt-4">
			<div class="label">
				<span class="label-text">Fale sobre sua necessidade</span>
				<!-- <span class="label-text-alt">Alt label</span> -->
			</div>
			<textarea
				name="descricao"
				class="textarea textarea-bordered h-24"
				placeholder="Digite o que você deseja..."
			></textarea>
		</label>

		<button class="btn btn-primary mt-4 w-full" type="submit">Solicitar serviço</button>

	</div>
</form>
