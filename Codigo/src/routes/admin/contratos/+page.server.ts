import { contratoController } from '$lib/server/db/controllers';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
 const { user, session } = locals;
    if (!user || !session) {
        return redirect(302, '/login');
    }

    const contratos = await contratoController.selectAllContratosWithRepresentante()

    return {contratos};
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async (event) => {
        try {
            const formData = await event.request.formData();
            const id = Number(formData.get('id'));
            await contratoController.deleteContrato(id)

            return {
				success: true,
				message: 'Contrato deletado com sucesso!'
			}
            
        } catch (error:any) {
            console.error(error.message)
			return {
				success: false,
				message: 'Falha ao deletar'
			}
        }


	}
};