<script lang="ts">
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import { format } from 'date-fns';
	import type { PageData } from './$types';
	import Alert from '$lib/components/Alert.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data: PageData;
	let contratos = data.contratos ?? [];

	interface PixResponse {
		type: 'success' | 'error';
		status?: number;
		data?: {
			qrCode: string;
			qrBase64: string;
			paymentId: string;
			contratoId: string;
		};
		error?: string;
	}

	let paymentStatus: 'pending' | 'processing' | 'approved' | 'failed' = 'pending';
	let paymentError: string | null = null;
	let showPaymentModal = false;
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let paymentInfo: PixResponse['data'] | null = null;

	const handlePixSubmit: SubmitFunction = async ({ formData, cancel }) => {
		paymentError = null;
		paymentStatus = 'processing';

		try {
			const response = await fetch('/api/pix-payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount: Number(formData.get('amount')),
					description: `Contrato #${formData.get('contratoId')}`,
					contratoId: formData.get('contratoId')
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to create PIX payment');
			}

			const result = await response.json();

			paymentInfo = {
				qrCode: result.data.qrCode,
				qrBase64: result.data.qrBase64,
				paymentId: result.data.paymentId,
				contratoId: Number(formData.get('contratoId'))
			};

			showPaymentModal = true;
			startPaymentPolling(result.data.paymentId);
		} catch (error) {
			console.error('Payment error:', error);
			paymentError = error instanceof Error ? error.message : 'Erro desconhecido';
			paymentStatus = 'failed';
			cancel();
		}
	};

	function startPaymentPolling(paymentId: string) {
		stopPolling();
		checkPaymentStatus(paymentId);

		intervalId = setInterval(() => checkPaymentStatus(paymentId), 5000);
	}

	function stopPolling() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	async function checkPaymentStatus(paymentId: string) {
		try {
			const response = await fetch(`/api/pix-payment?paymentId=${paymentId}`);
			if (!response.ok) throw new Error('Falha ao verificar status');

			const { status } = await response.json();

			if (status === 'approved') {
				stopPolling();
				paymentStatus = 'approved';
				// Update contract status
				if (paymentInfo?.contratoId) {
					data.contratos = data.contratos.map((c) =>
						c.id === paymentInfo.contratoId ? { ...c, status_pagamento: 'pago' } : c
					);
				}
			} else if (status === 'rejected' || status === 'cancelled') {
				stopPolling();
				paymentStatus = 'failed';
				paymentError = 'Pagamento falhou ou foi cancelado';
			}
		} catch (error) {
			console.error('Status check error:', error);
		}
	}

	onDestroy(() => {
		stopPolling();
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-6">Meus Contratos</h1>

	<!-- Error Display -->
	{#if paymentError}
		<div class="mb-4">
			<Alert message={paymentError} success={false} />
		</div>
	{/if}

	{#if contratos.length > 0}
		<div class="space-y-4">
			{#each contratos as contrato}
				<div class="card bg-base-100 shadow-lg">
					<div class="card-body">
						<h2 class="card-title">Contrato #{contrato.id}</h2>
						<p>Data de Emissão: {format(contrato.date_emission || '', 'dd/MM/yyy')}</p>
						<p>Data de Expiração: {format(contrato.date_expire, 'dd/MM/yyy')}</p>
						<p>Valor: R$ {contrato.valor_pagamento?.toFixed(2) || '0,00'}</p>
						<p>
							Status:
							{#if contrato.status_pagamento === 'pago'}
								<span class="badge badge-success">Pago</span>
							{:else if contrato.status_pagamento === 'processando'}
								<span class="badge badge-warning">Processando</span>
							{:else}
								<span class="badge badge-error">Pendente</span>
							{/if}
						</p>

						<div class="flex flex-wrap gap-2 mt-4">
							{#if data.fullUser && data.fullUser.tipo === 'cliente' && contrato.status_pagamento !== 'pago'}
								<form
									method="POST"
									action="?/createPix"
									use:enhance={handlePixSubmit}
									class="flex-1 min-w-[200px]"
								>
									<input type="hidden" name="contratoId" value={contrato.id} />
									<input type="hidden" name="amount" value={contrato.valor_pagamento} />

									<button
										type="submit"
										class="btn btn-primary w-full"
										disabled={paymentStatus === 'processing' &&
											paymentInfo?.contratoId === contrato.id}
									>
										{#if paymentInfo?.contratoId === contrato.id}
											{#if paymentStatus === 'approved'}
												✅ Pago
											{:else if paymentStatus === 'processing'}
												⏳ Processando...
											{:else if paymentStatus === 'failed'}
												Tentar novamente
											{:else}
												Pagar com PIX
											{/if}
										{:else}
											Pagar com PIX
										{/if}
									</button>
								</form>
							{/if}

							<a
								class="btn btn-outline flex-1 min-w-[200px]"
								href="/admin/acompanhamento/{contrato.id}"
							>
								Ver contrato
							</a>

							{#if data.fullUser && data.fullUser.tipo === 'representante'}
								<a
									href="/customer/relatorio/criar/{contrato.id}"
									class="btn btn-secondary flex-1 min-w-[200px]"
								>
									Novo relatório
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="alert alert-info">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<span>Nenhum contrato encontrado.</span>
		</div>
	{/if}

	<!-- Payment Modal -->
	{#if showPaymentModal && paymentInfo}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white rounded-lg p-6 max-w-md w-full">
				<h3 class="text-xl font-bold mb-4">Pagamento via PIX</h3>

				{#if paymentInfo.qrBase64}
					<div class="flex justify-center mb-4">
						<img
							src={`data:image/png;base64,${paymentInfo.qrBase64}`}
							alt="QR Code PIX"
							class="w-48 h-48 border-4 border-white shadow-lg"
							on:error={(e) => {
								console.error('Failed to load QR code:', e);
								paymentInfo.qrBase64 = null;
							}}
						/>
					</div>
				{:else}
					<div class="alert alert-warning mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span>QR Code não disponível. Use o código PIX abaixo:</span>
					</div>
				{/if}

				<div class="bg-gray-100 p-3 rounded mb-4 overflow-x-auto">
					<p class="text-sm font-mono break-all text-center">
						{paymentInfo.qrCode || 'Código PIX não disponível'}
					</p>
				</div>

				<div class="text-center mb-4">
					<p class="text-lg font-semibold">
						R$ {contratos
							.find((c) => c.id === paymentInfo?.contratoId)
							?.valor_pagamento?.toFixed(2) || '0,00'}
					</p>
					<p class="text-sm mt-2">
						Status:
						{#if paymentStatus === 'approved'}
							<span class="text-success">✅ Pago</span>
						{:else if paymentStatus === 'failed'}
							<span class="text-error">❌ Falhou</span>
						{:else}
							<span class="text-warning">⏳ Aguardando pagamento...</span>
						{/if}
					</p>
				</div>

				<div class="flex flex-col space-y-2">
					<button
						on:click={() => {
							navigator.clipboard.writeText(paymentInfo.qrCode || '');
							alert('Código PIX copiado!');
						}}
						class="btn btn-outline w-full"
					>
						Copiar Código PIX
					</button>

					<button on:click={() => (showPaymentModal = false)} class="btn btn-primary w-full">
						Fechar
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.badge-success {
		background-color: #dcfce7;
		color: #166534;
	}
	.badge-warning {
		background-color: #fef9c3;
		color: #854d0e;
	}
	.badge-error {
		background-color: #fee2e2;
		color: #991b1b;
	}
	.text-success {
		color: #16a34a;
	}
	.text-warning {
		color: #ca8a04;
	}
	.text-error {
		color: #dc2626;
	}
</style>
