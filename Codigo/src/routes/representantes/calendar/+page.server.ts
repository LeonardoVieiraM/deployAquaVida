import {
	eventController,
	representanteController,
	clienteController
} from '$lib/server/db/controllers';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = locals;

	if (!user || !session) {
		throw redirect(302, '/login');
	}

	// Buscar o representante logado
	const representante = await representanteController.selectRepresentanteByUserId(user.id);
	if (!representante) {
		throw fail(403, { error: 'Usuário não é um representante válido.' });
	}
	//const representanteId = representante.id;

	// Buscar clientes desse representante
	const clientes = await representanteController.selectClientesByRepresentante(user.id);

	// Buscar eventos vinculados a este representante
	const eventosDoRepresentante = await eventController.selectEventsByUser(representante[0].id, 'representante');
	if (!eventosDoRepresentante) {
		throw fail(500, { error: 'Erro ao buscar eventos do representante.' });
	}

	// Mapear nomes dos clientes
	const clienteMap = new Map(clientes.map((c) => [c.id, c.name]));

	const events = eventosDoRepresentante.map((event) => ({
		id: event.id.toString(),
		title: event.titulo,
		start: event.data.toISOString(),
		cliente_id: event.cliente_id,
		cliente_name: event.cliente_id ? clienteMap.get(event.cliente_id) || 'Desconhecido' : 'Desconhecido',
		representante_id: representante[0].id,
		representante_name: representante[0].name,
		local: event.local,
		descricao: event.descricao
	}));

	return {
		events,
		clientes,
		representante,
		user,
		session
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { user } = locals;
		const representante = await representanteController.selectRepresentanteByUserId(user.id);
		if (!representante) {
			return fail(403, { error: 'Representante não autorizado.' });
		}

		const formData = await request.formData();
		const titulo = formData.get('titulo') as string;
		const local = formData.get('local') as string;
		const dataStr = formData.get('data') as string;
		const descricao = formData.get('descricao') as string;
		const cliente_id = Number(formData.get('cliente_id'));

		if (!titulo || !local || !dataStr || isNaN(cliente_id)) {
			return fail(400, { error: 'Campos obrigatórios ausentes ou inválidos.' });
		}

		const data = new Date(dataStr);
		if (isNaN(data.getTime())) {
			return fail(400, { error: 'Data inválida.' });
		}

		await eventController.insertEvent({
			titulo,
			local,
			data,
			descricao,
			representante_id: representante[0].id,
			cliente_id
		});

		throw redirect(303, '/representantes/calendar');
	},

	update: async ({ request, locals }) => {
		const { user } = locals;
		const representante = await representanteController.selectRepresentanteByUserId(user.id);
		if (!representante) {
			return fail(403, { error: 'Representante não autorizado.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const titulo = formData.get('titulo') as string;
		const local = formData.get('local') as string;
		const descricao = formData.get('descricao') as string;
		const dataStr = formData.get('data') as string;
		const cliente_id = Number(formData.get('cliente_id'));

		if (isNaN(id) || !titulo || !local || !dataStr || isNaN(cliente_id)) {
			return fail(400, { error: 'Campos obrigatórios ausentes ou inválidos.' });
		}

		const data = new Date(dataStr);
		if (isNaN(data.getTime())) {
			return fail(400, { error: 'Data inválida.' });
		}

		await eventController.updateEvent(id, {
			titulo,
			local,
			data,
			descricao,
			representante_id: representante[0].id,
			cliente_id
		});

		throw redirect(303, '/representantes/calendar');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (isNaN(id)) {
			return fail(400, { error: 'ID inválido.' });
		}

		await eventController.deleteEvent(id);
		throw redirect(303, '/representantes/calendar');
	}
};
