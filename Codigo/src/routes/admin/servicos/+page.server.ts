import {servicoController } from '$lib/server/db/controllers';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	const servicos = await servicoController.selectAllServicos();
	return { servicos };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const data = await request.formData();
			const name = String(data.get('name'));
			const description = String(data.get('description'));
	
			await servicoController.insertServico({ name, description });

			return {
				success: true,
				message: 'Serviço criado com sucesso!'
			}
			
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao criar'
			}
		}
	},
	delete: async ({ request }) => {
		try {
			const data = await request.formData();
			const id = Number(data.get('id'));
	
			await servicoController.deleteServico(id);

			return {
				success: true,
				message: 'Serviço deletado com sucesso!'
			}
			
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao deletar, existe um template ou pedido com esse serviço'
			}
		}
	},
	update: async ({ request }) => {
		try {
			const data = await request.formData();
			const id = Number(data.get('id'));
			const name = String(data.get('name'));
			const description = String(data.get('description'));
	
			await servicoController.updateServico(id, { name, description });

			return {
				success: true,
				message: 'Serviço editado com sucesso!'
			}
			
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao editar serviço'
			}
		}
	}
};
