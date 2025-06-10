import { clienteController, representanteController } from '$lib/server/db/controllers';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({locals}) => {

	const { user, session } = locals;

	if (!user || !session) {
			return redirect(302, '/login');
		}
	const clientes = await clienteController.selectAllClientes();
	const representantes = await representanteController.selectAllRepresentantes();
	return { clientes,representantes };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const data = await request.formData();
			const name = String(data.get('name'));
			const cnpj = String(data.get('cnpj'));
			const email = String(data.get('email'))
			const endereco = String(data.get('endereco'))
			const representante_id = Number(data.get('representante_id'));
	
			await clienteController.insertCliente({ name, cnpj,email,endereco,representante_id });

			return {
				success: true,
				message: 'Cliente criado com sucesso!'
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
	
			await clienteController.deleteCliente(id);
			return {
				success: true,
				message: 'Cliente deletado com sucesso!'
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao deletar'
			}
		}
	},
	update: async ({ request }) => {
		try {
			const data = await request.formData();
			const id = Number(data.get('id'));
			const name = String(data.get('name'));
			const cnpj = String(data.get('cnpj'));
			const email = String(data.get('email'))
			const endereco = String(data.get('endereco'))
			const representante_id = Number(data.get('representante_id'));
	
			await clienteController.updateCliente(id, { name, cnpj, email, endereco, representante_id });
			return {
				success: true,
				message: 'Cliente atualizado com sucesso!'
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao atualizar'
			}
		}
	}
};
