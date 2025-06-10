<script lang="ts">
	import FullCalendar, { type CalendarOptions } from 'svelte-fullcalendar';
	import daygridPlugin from '@fullcalendar/daygrid';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import { onMount } from 'svelte';
	export let data;

	let showModal = false;
	let isEdit = false;
	let selectedDate: Date | null = null;
	let selectedEvent = null;
	let eventId = 0;

	let meetingName = '';
	let meetingTime = '09:00';
	let local = '';
	let descricao = '';
	let selectedClienteId = '';
	let selectedRepresentanteId = '';
	let isVideoConferencia = false;

	let options: CalendarOptions = {
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin, timeGridPlugin, interactionPlugin],
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth'
		},
		editable: false,
		selectable: true,
		events: data.events,
		dateClick: (info) => {
			selectedDate = info.date;
			meetingName = '';
			meetingTime = '09:00';
			local = '';
			descricao = '';
			selectedClienteId = '';
			selectedRepresentanteId = '';
			isEdit = false;
			showModal = true;
		},
		eventClick: (info) => {
			const event = info.event.extendedProps;
			selectedEvent = info.event;

			meetingName = info.event.title;
			selectedDate = new Date(info.event.startStr);
			meetingTime = selectedDate.toISOString().slice(11, 16);
			local = event.local;
			descricao = event.descricao ?? '';
			selectedClienteId = String(event.cliente_id);
			selectedRepresentanteId = String(event.representante_id);
			eventId = Number(info.event.id);

			if (isNaN(eventId) || eventId <= 0) {
				console.error('ID do evento inválido:', info.event.id);
				return;
			}

			isEdit = true;
			showModal = true;
		},
		eventContent: (arg) => {
			const { event } = arg;
			const { local, descricao, cliente_name, representante_name } = event.extendedProps;

			// Formatar o horário em formato 24h (HH:mm)
			let formattedTime = 'Não especificado';
			if (event.start) {
				const startDate = new Date(event.start);
				const hours = startDate.getHours().toString().padStart(2, '0');
				const minutes = startDate.getMinutes().toString().padStart(2, '0');
				formattedTime = `${hours}:${minutes}`;
			}

			const content = document.createElement('div');
			content.innerHTML = `
              <div class="event-title" style="font-size: 20px; padding-bottom: 10px; max-width: 200px; overflow-wrap: break-word;"><strong>${event.title}</strong></div>
              <div class="event-time" style="padding-bottom: 10px; font-size: 16px;"><strong>Horário:</strong> ${formattedTime}</div>
              <div class="event-local"><strong>Local:</strong> ${local || 'Não especificado'}</div>
              <div class="event-cliente"><strong>Cliente:</strong> ${cliente_name || 'Desconhecido'}</div>
              <div class="event-representante"><strong>Representante:</strong> ${representante_name || 'Desconhecido'}</div>
              ${descricao ? `<div class="event-descricao"><strong>Descrição:</strong> ${descricao}</div>` : ''}
          `;
			return { domNodes: [content] };
		}
	};

	function closeModal() {
		showModal = false;
		selectedDate = null;
	}

	function handleClienteChange(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		const cliente = data.clientes.find((c) => String(c.id) === selectedId);
		if (cliente && cliente.endereco) {
			local = cliente.endereco;
		}
	}

	function handleVideoConferenciaChange() {
		if (isVideoConferencia) {
			local = 'Video conferência';
		} else {
			local = '';
		}
	}
</script>

<div class="calendar-container">
	<FullCalendar {options} />
</div>

{#if showModal}
	<div class="modal-overlay" on:click={closeModal}>
		<div class="modal-content" on:click|stopPropagation>
			<h2>{isEdit ? 'Editar Reunião' : 'Nova Reunião'}</h2>
			<p>Data: {selectedDate?.toLocaleDateString()}</p>

			<form method="POST" action={isEdit ? '?/update' : '?/create'}>
				{#if isEdit}
					<input type="hidden" name="id" value={eventId} />
				{/if}
				<input
					type="hidden"
					name="data"
					value={selectedDate?.toISOString().split('T')[0] + 'T' + meetingTime}
				/>

				<div class="form-group">
					<label for="meetingName">Nome da Reunião:</label>
					<input id="meetingName" type="text" name="titulo" bind:value={meetingName} required />
				</div>

				<div class="form-group">
					<label for="meetingTime">Horário:</label>
					<input id="meetingTime" type="time" bind:value={meetingTime} required />
				</div>

				<div class="form-group">
					<label for="representante">Representante:</label>
					<select name="representante_id" bind:value={selectedRepresentanteId} required>
						<option value="" disabled selected>Selecione um representante</option>
						{#each data.representantes as representante}
							<option value={representante.id}>{representante.name}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="cliente">Cliente:</label>
					<select
						name="cliente_id"
						bind:value={selectedClienteId}
						on:change={handleClienteChange}
						required
					>
						<option value="" disabled>Selecione um cliente</option>
						{#each data.clientes as cliente}
							<option value={cliente.id}>{cliente.name}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label for="local">Local:</label>
					<div style="display: flex; align-items: center; gap: 10px;">
						<input
							id="local"
							type="text"
							name="local"
							value={local}
							on:input={(e) => !isVideoConferencia && (local = e.target.value)}
							required
							readonly={isVideoConferencia}
							style="flex: 1;"
						/>
						<div style="display: flex; align-items: center; white-space: nowrap;">
							<input
								type="checkbox"
								id="videoConferencia"
								bind:checked={isVideoConferencia}
								on:change={() => {
									if (isVideoConferencia) {
										local = 'Video conferência';
									} else {
										local = '';
									}
								}}
							/>
							<label for="videoConferencia" style="margin-left: 5px;">Videoconferência</label>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="descricao">Descrição:</label>
					<textarea id="descricao" name="descricao" bind:value={descricao}></textarea>
				</div>

				<div class="buttons">
					<button type="submit" class="add-btn"
						>{isEdit ? 'Atualizar Reunião' : 'Adicionar Reunião'}</button
					>
					<button type="button" class="cancel-btn" on:click={closeModal}>Cancelar</button>

					{#if isEdit}
						<form method="POST" action="?/delete">
							<input type="hidden" name="id" value={eventId} />
							<button
								type="submit"
								class="neutral-btn"
								style="background-color: gray; color: white;">Excluir Reunião</button
							>
						</form>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.calendar-container {
		max-width: 1500px;
		margin: auto;
		margin-top: 15px;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 500;
	}

	.modal-content {
		background: white;
		padding: 20px;
		border-radius: 5px;
		min-width: 700px;
		text-align: center;
	}

	.form-group {
		margin: 15px 0;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 5px;
	}

	input[type='text'],
	input[type='time'],
	select,
	textarea {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.buttons {
		margin-top: 20px;
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	button {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.add-btn {
		background: #28a745;
		color: white;
	}

	.add-btn:hover {
		background: #218838;
	}

	.cancel-btn {
		background: #dc3545;
		color: white;
	}

	.cancel-btn:hover {
		background: #c82333;
	}

	:global(.fc-event) {
		padding: 8px;
		font-size: 14px;
		line-height: 1.8;
		white-space: normal;
	}

	:global(.fc-event-main) {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
</style>
