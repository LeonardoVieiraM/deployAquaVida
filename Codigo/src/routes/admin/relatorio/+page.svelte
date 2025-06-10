<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { Chart as ChartInstance } from 'chart.js';

	let dataOriginal: any[] = [];
	let data: any[] = [];
	let isLoading = true;
	let error = null;

	let chartLineEl: HTMLCanvasElement;
	let chartPieEl: HTMLCanvasElement;
	let chartBarEl: HTMLCanvasElement;

	// Estados para controlar a visibilidade dos gráficos
	let showBarChart = true;
	let showPieChart = true;
	let showLineChart = true;

	let charts: ChartInstance[] = [];

	function destruirGraficos() {
		charts.forEach((chart) => chart.destroy());
		charts = [];
	}

	async function atualizarGraficos() {
		destruirGraficos();

		// Aguardar atualização do DOM
		await tick();

		// Verificar se os elementos ainda existem no DOM
		if (showBarChart && chartBarEl) {
			criarGraficoBarras();
		}
		if (showPieChart && chartPieEl) {
			criarGraficoPizza();
		}
		if (showLineChart && chartLineEl) {
			criarGraficoLinha();
		}
	}

	function criarGraficoBarras() {
		if (!chartBarEl || data.length === 0) return;

		const totalFaturamento = data.reduce((sum, rep) => sum + rep.total_faturamento, 0);

		charts.push(
			new Chart(chartBarEl, {
				type: 'bar',
				data: {
					labels: data.map((r) => r.representante),
					datasets: [
						{
							label: 'Faturamento Total (R$)',
							data: data.map((r) => r.total_faturamento),
							backgroundColor: data.map((_, i) => `hsl(${(i * 70) % 360}, 70%, 60%)`),
							borderRadius: 6,
							borderWidth: 0
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: {
							callbacks: {
								label: (context) => {
									const percentage = ((context.parsed.y / totalFaturamento) * 100).toFixed(1);
									return `R$ ${context.parsed.y.toFixed(2)} (${percentage}%)`;
								}
							},
							backgroundColor: 'rgba(30, 41, 59, 0.9)',
							titleColor: '#38bdf8',
							bodyColor: '#e2e8f0',
							padding: 10
						}
					},
					scales: {
						x: {
							ticks: {
								color: '#94a3b8',
								font: {
									size: 11
								}
							},
							grid: {
								display: false,
								drawBorder: false
							}
						},
						y: {
							ticks: {
								color: '#94a3b8',
								callback: (value) => `R$ ${value}`
							},
							grid: {
								color: 'rgba(148, 163, 184, 0.1)',
								drawBorder: false
							}
						}
					}
				}
			})
		);
	}

	function criarGraficoPizza() {
		if (!chartPieEl || data.length === 0) return;

		const totalClientes = data.reduce((sum, rep) => sum + rep.total_clientes, 0);

		charts.push(
			new Chart(chartPieEl, {
				type: 'pie',
				data: {
					labels: data.map(
						(r) => `${r.representante} (${((r.total_clientes / totalClientes) * 100).toFixed(1)}%)`
					),
					datasets: [
						{
							data: data.map((r) => r.total_clientes),
							backgroundColor: [
								'#36a2eb',
								'#ff6384',
								'#ffcd56',
								'#4bc0c0',
								'#9966ff',
								'#ff9f40',
								'#8ac926',
								'#1982c4'
							],
							borderWidth: 0
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'right',
							labels: {
								color: '#e2e8f0',
								font: {
									size: 11,
									family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
								},
								padding: 15,
								boxWidth: 15
							},
							align: 'start'
						},
						tooltip: {
							callbacks: {
								label: (context) => {
									const value = context.parsed;
									const percentage = ((value / totalClientes) * 100).toFixed(1);
									return `${context.label.split(' (')[0]}: ${value} clientes (${percentage}%)`;
								}
							},
							backgroundColor: 'rgba(30, 41, 59, 0.9)',
							titleColor: '#38bdf8',
							bodyColor: '#e2e8f0',
							padding: 10
						}
					}
				}
			})
		);
	}

	function criarGraficoLinha() {
		if (!chartLineEl || data.length === 0) return;

		const meses = Array.from(
			new Set(data.flatMap((r: any) => r.historico_mensal.map((h: any) => h.mes)))
		).sort();

		const datasets = data.map((rep) => ({
			label: rep.representante,
			data: meses.map((mes) => {
				const item = rep.historico_mensal.find((h: any) => h.mes === mes);
				return item ? item.valor : 0;
			}),
			fill: false,
			tension: 0.3,
			borderWidth: 3,
			pointRadius: 5,
			pointHoverRadius: 8
		}));

		charts.push(
			new Chart(chartLineEl, {
				type: 'line',
				data: { labels: meses, datasets },
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'top',
							labels: {
								color: '#e2e8f0',
								font: {
									size: 12
								},
								padding: 20
							}
						},
						tooltip: {
							callbacks: {
								title: (context) => context[0].label,
								label: (context) => {
									return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
								}
							},
							displayColors: false,
							backgroundColor: 'rgba(30, 41, 59, 0.9)',
							titleColor: '#38bdf8',
							bodyColor: '#e2e8f0',
							padding: 12,
							bodyFont: {
								size: 13
							}
						}
					},
					scales: {
						x: {
							ticks: {
								color: '#94a3b8',
								maxRotation: 45,
								minRotation: 45
							},
							grid: {
								color: 'rgba(148, 163, 184, 0.1)',
								drawBorder: false
							}
						},
						y: {
							ticks: {
								color: '#94a3b8',
								callback: (value) => `R$ ${value}`
							},
							grid: {
								color: 'rgba(148, 163, 184, 0.1)',
								drawBorder: false
							}
						}
					},
					interaction: {
						mode: 'nearest',
						intersect: true
					},
					hover: {
						mode: 'nearest',
						intersect: true
					}
				}
			})
		);
	}

	async function carregarDados() {
		try {
			isLoading = true;
			error = null;

			const res = await fetch('/api/relatorio');
			if (!res.ok) throw new Error('Erro ao carregar dados');

			dataOriginal = await res.json();
			data = [...dataOriginal];
			await atualizarGraficos();
		} catch (err) {
			error = err.message || 'Erro desconhecido';
			console.error('Erro ao carregar dados:', err);
		} finally {
			isLoading = false;
		}
	}

	function exportarCSV() {
		if (data.length === 0) return;

		const headers = ['Representante', 'Total Clientes', 'Faturamento Total (R$)'];
		const rows = data.map((d) => [
			d.representante,
			d.total_clientes,
			d.total_faturamento.toFixed(2)
		]);

		const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `relatorio-${new Date().toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Funções para alternar a visibilidade dos gráficos
	async function toggleBarChart() {
		showBarChart = !showBarChart;
		await atualizarGraficos();
	}

	async function togglePieChart() {
		showPieChart = !showPieChart;
		await atualizarGraficos();
	}

	async function toggleLineChart() {
		showLineChart = !showLineChart;
		await atualizarGraficos();
	}

	async function toggleAllCharts() {
		if (showBarChart && showPieChart && showLineChart) {
			showBarChart = false;
			showPieChart = false;
			showLineChart = false;
		} else {
			showBarChart = true;
			showPieChart = true;
			showLineChart = true;
		}
		await atualizarGraficos();
	}

	onMount(carregarDados);
</script>

<div class="container">
	<h2>📊 Relatório de Desempenho</h2>

	<div class="filters">
		<div class="btn-group">
			<button class="export" on:click={exportarCSV} disabled={data.length === 0}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path
						d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
					/>
					<path
						d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
					/>
				</svg>
				Exportar CSV
			</button>
		</div>

		<!-- Botões para mostrar/esconder diagramas -->
		<div class="toggle-group">
			<button class="toggle-btn" class:active={showBarChart} on:click={toggleBarChart}>
				{#if showBarChart}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"
						/>
						<path
							d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"
						/>
					</svg>
				{/if}
				Faturamento Total
			</button>

			<button class="toggle-btn" class:active={showPieChart} on:click={togglePieChart}>
				{#if showPieChart}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
						<path
							d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"
						/>
						<path
							d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"
						/>
					</svg>
				{/if}
				Clientes por Rep.
			</button>

			<button class="toggle-btn" class:active={showLineChart} on:click={toggleLineChart}>
				{#if showLineChart}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"
						/>
						<path
							d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"
						/>
					</svg>
				{/if}
				Faturamento Mensal
			</button>

			<button class="toggle-btn" on:click={toggleAllCharts}>
				{#if showBarChart && showPieChart && showLineChart}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"
						/>
						<path
							d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"
						/>
					</svg>
				{/if}
				{#if showBarChart && showPieChart && showLineChart}
					Ocultar Todos
				{:else}
					Mostrar Todos
				{/if}
			</button>
		</div>
	</div>

	{#if isLoading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Carregando dados...</p>
		</div>
	{:else if error}
		<div class="error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.5 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
				/>
			</svg>
			<p>Erro ao carregar dados: {error}</p>
			<button class="btn btn-primary" on:click={carregarDados}>Tentar novamente</button>
		</div>
	{:else if data.length === 0}
		<div class="empty">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
				/>
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
				/>
			</svg>
			<p>Nenhum dado disponível</p>
		</div>
	{:else}
		<div
			id="charts-container"
			class:single-chart={[showBarChart, showPieChart, showLineChart].filter(Boolean).length === 1}
		>
			{#if showBarChart}
				<div class="chart-card">
					<div class="card-header">
						<h3>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"
								/>
							</svg>
							Faturamento Total
						</h3>
					</div>
					<div class="chart-container">
						<canvas bind:this={chartBarEl}></canvas>
					</div>
				</div>
			{/if}

			{#if showPieChart}
				<div class="chart-card">
					<div class="card-header">
						<h3>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
								<path
									d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"
								/>
							</svg>
							Clientes por Representante
						</h3>
					</div>
					<div class="chart-container">
						<canvas bind:this={chartPieEl}></canvas>
					</div>
				</div>
			{/if}

			{#if showLineChart}
				<div class="chart-card">
					<div class="card-header">
						<h3>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									d="M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"
								/>
							</svg>
							Faturamento Mensal
						</h3>
					</div>
					<div class="chart-container">
						<canvas bind:this={chartLineEl}></canvas>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-color: #0f172a;
		color: #e2e8f0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		padding-bottom: 2rem;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}

	h2 {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #38bdf8;
		text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
		padding-top: 1rem;
	}

	.filters {
		background: #1e293b;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}

	.btn-group {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.toggle-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		border: none;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	button.export {
		background: #10b981;
		color: white;
	}

	button.export:hover {
		background: #059669;
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
	}

	.toggle-btn {
		background: #4b5563;
		color: #e2e8f0;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.toggle-btn.active {
		background: #3b82f6;
	}

	.toggle-btn:hover {
		background: #374151;
	}

	.toggle-btn.active:hover {
		background: #2563eb;
	}

	#charts-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: 2rem;
		align-items: stretch;
	}

	.single-chart {
		grid-template-columns: 1fr;
	}

	.chart-card {
		background: #1e293b;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		height: 500px;
		transition: all 0.3s ease;
	}

	.single-chart .chart-card {
		max-width: 95%;
		width: 95%;
		margin: 0 auto;
		height: 70vh;
		min-height: 600px;
		max-height: 800px;
	}

	.card-header {
		padding: 1.2rem 1.2rem 0.8rem;
		background: rgba(30, 41, 59, 0.8);
		border-bottom: 1px solid #334155;
	}

	.card-header h3 {
		margin: 0;
		font-size: 1.3rem;
		color: #38bdf8;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
		text-align: center;
	}

	.chart-container {
		flex: 1;
		padding: 1rem;
		position: relative;
		min-height: 400px;
		width: 100%;
	}

	.loading,
	.error,
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		padding: 2rem;
	}

	.loading {
		color: #94a3b8;
	}

	.error {
		color: #f87171;
	}

	.empty {
		color: #94a3b8;
	}

	.spinner {
		border: 4px solid rgba(56, 189, 248, 0.2);
		border-top: 4px solid #38bdf8;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 1200px) {
		#charts-container {
			grid-template-columns: 1fr;
		}

		.chart-card {
			height: 450px;
		}
	}

	@media (max-width: 768px) {
		.chart-card {
			height: 400px;
		}

		.card-header h3 {
			font-size: 1.1rem;
		}

		.toggle-group {
			flex-direction: column;
			align-items: center;
		}

		button,
		.toggle-btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 768px) {
		.single-chart .chart-card {
			height: 60vh;
			min-height: 500px;
			max-height: 600px;
		}
	}

	@media (max-width: 1200px) {
		#charts-container {
			grid-template-columns: 1fr;
		}

		.chart-card {
			height: 450px;
		}
	}

	.single-chart .chart-container {
		min-height: 500px;
	}
</style>
