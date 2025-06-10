import { clienteController } from '$lib/server/db/controllers';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({locals}) => {
	const { user, session } = locals;
	if (!user || !session) {
		return redirect(302, '/login');
	}
	const pedidos = await clienteController.selectAllPedidos();
	return { pedidos };
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
