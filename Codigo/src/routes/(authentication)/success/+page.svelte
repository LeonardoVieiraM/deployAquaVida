<script lang="ts">
	import { getUserContext } from '$lib/stores/user';

	const user = getUserContext();
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 my-auto">
	<div class="p-8 rounded-lg shadow-md max-w-md w-full text-center my-auto">

		<h2 class="text-xl font-bold mb-2">Login realizado com sucesso, {$user?.username}!</h2>
		<p class="text-opacity-50 mb-4">Bem-vindo de volta! Você entrou com sucesso.</p>
		<a href="/" class=" underline">Ir para a página inicial</a>
	</div>
</div>
