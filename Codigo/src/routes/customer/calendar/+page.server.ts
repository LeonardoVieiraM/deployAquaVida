import {
	eventController,
	representanteController,
	clienteController,
	userController
} from '$lib/server/db/controllers';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = locals;

	if (!user || !session) {
		throw redirect(302, '/login');
	}

	// Buscar cliente via usuário
	const cliente = await clienteController.selectClienteByUserId(user.id);

	if (!cliente) {
		throw fail(403, { error: 'Usuário não é um cliente válido.' });
	}

	const representante = await representanteController.selectRepresentanteById(Number(cliente.representante_id));

	
	const eventosDoCliente = eventController.selectEventsByUser(Number(user.id), 'cliente');

	const events = (await eventosDoCliente).map((event) => ({
		id: event.id.toString(),
		title: event.titulo,
		start: event.data.toISOString(),
		cliente_id: cliente.id,
		cliente_name: cliente.name,
		representante_id: representante[0].id,
		representante_name: representante[0].name,
		local: event.local,
		descricao: event.descricao
	}));

	return {
		events,
		representante,
		cliente,
		user,
		session
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { user } = locals;
		const cliente = await clienteController.selectClienteByUserId(user.id);

		if (!cliente) {
			return fail(403, { error: 'Cliente não autorizado.' });
		}

		const formData = await request.formData();
		const titulo = formData.get('titulo') as string;
		const local = formData.get('local') as string;
		const dataStr = formData.get('data') as string;
		const descricao = formData.get('descricao') as string;
		const representante_id = Number(formData.get('representante_id'));

		if (!titulo || !local || !dataStr || isNaN(representante_id)) {
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
			cliente_id: cliente.id,
			representante_id
		});

		throw redirect(303, '/customer/calendar');
	},

	update: async ({ request, locals }) => {
		const { user } = locals;
		const cliente = await clienteController.selectClienteByUserId(user.id);

		if (!cliente) {
			return fail(403, { error: 'Cliente não autorizado.' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const titulo = formData.get('titulo') as string;
		const local = formData.get('local') as string;
		const descricao = formData.get('descricao') as string;
		const dataStr = formData.get('data') as string;
		const representante_id = Number(formData.get('representante_id'));

		if (isNaN(id) || !titulo || !local || !dataStr || isNaN(representante_id)) {
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
			cliente_id: cliente.id,
			representante_id
		});

		throw redirect(303, '/customer/calendar');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (isNaN(id)) {
			return fail(400, { error: 'ID inválido.' });
		}

		await eventController.deleteEvent(id);
		throw redirect(303, '/customer/calendar');
	}
};
