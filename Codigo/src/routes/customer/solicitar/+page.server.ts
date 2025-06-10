import { clienteController, servicoController } from '$lib/server/db/controllers';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

export const load = (async ({locals}) => {
	const { user, session } = locals;
	if (!user || !session) {
		return redirect(302, '/login');
	}
	const servicos = await servicoController.selectAllServicos();
	return { servicos };
}) satisfies PageServerLoad;

export const actions: Actions = {
	solicitar: async (event) => {
		const formData = await event.request.formData();
		const servicoId = formData.get('servico');
		const descricao = formData.get('descricao');

		const user = await event.locals.user;

		if (!user) {
			return fail(401, { message: 'Usuário não autenticado.' });
		}

		const userEmail = user.email

		const cliente = await clienteController.getClienteByEmail(userEmail);
		if (!cliente) {
			return fail(404, { message: 'Cliente não encontrado, você precisa ser um cliente para realizar um pedido.' });
		}

		const clienteId = cliente.id;

		if (!servicoId || typeof servicoId !== 'string') {
			return fail(400, { message: 'Por favor, selecione um serviço.' });
		}

		const servico_id = Number(servicoId);

		if (!descricao) {
			return fail(400, { message: 'Por favor, descreva sua necessidade.' });
		}

		try {
			await clienteController.insertPedido({
				description: descricao as string,
				status: 'pendente',
				servico_id: servico_id,
				cliente_id: clienteId
			});
	
			return {
				success: true,
				message: 'Pedido solicitado com sucesso!'
			}
			
		} catch (error:any) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao solicitar'
			}
		}

	}
};
