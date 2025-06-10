
import { clienteController, contratoController, userController } from '$lib/server/db/controllers';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params,locals }) => {
	const { user, session } = locals;
    const id = Number(params.id);
    const pedidos = await clienteController.selectAllPedidos()
    const contrato = await contratoController.selectContratoByIdClientRepresentante2(id);

	if (!contrato) {
		throw new Error(`Contrato não encontrado para o ID do cliente: ${id}`);
	}

	if (!user || !session) {
		return redirect(302, '/login');
	}


    const [fullUser] = await userController.getUserByEmail(user.email);
	
    return {contrato, pedidos,fullUser};
}) satisfies PageServerLoad;

export const actions: Actions = {
	aceitarPedido: async ({ request }) => {
		const data = await request.formData();
		const pedidoId = Number(data.get('pedidoId'));

		await clienteController.updatePedido(pedidoId, { status: 'aderido' });
	},

	recusarPedido: async ({ request }) => {
		const data = await request.formData();
		const pedidoId = Number(data.get('pedidoId'));

		await clienteController.updatePedido(pedidoId, { status: 'recusado' });
	}
};
