<script lang="ts">
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import ThemeSwitch from '$lib/components/navbar/ThemeSwitch.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { createUserContext } from '$lib/stores/user';
	import type { LayoutData } from './$types';
	import { redirect } from '@sveltejs/kit';

	export let data: LayoutData;

	onMount(() => {
		themeChange(false);
	});

	const user = createUserContext(data.user);
	$: user.set(data.user);

	let showDialogflow = false;

	onMount(() => {
		if (data.user?.tipo === 'cliente') {
			showDialogflow = true;
			if (typeof window !== 'undefined') {
				const script = document.createElement('script');
				script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
				script.async = true;
				document.head.appendChild(script);
			}
		}
	});
</script>

<div>
	<Navbar fullUser={data.fullUser} servicos={data.servicos} />
	<slot />
</div>

<df-messenger
	intent="WELCOME"
	chat-title="AquaVida"
	agent-id="9f6b2091-807f-4325-826e-3c29a0891e8c"
	language-code="pt-br"
></df-messenger>

<style>
	df-messenger {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 1000;
	}
</style>
