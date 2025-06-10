import { representanteController } from '$lib/server/db/controllers';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    try {
        const userId = locals.session?.userId
        if(!userId){
            console.error("Error")
            return
        }
        const clientes = await representanteController.selectClientesByRepresentante(userId)
        return {clientes:clientes};
    } catch (error:any) {
        console.error(error.message)
    }
}) satisfies PageServerLoad;