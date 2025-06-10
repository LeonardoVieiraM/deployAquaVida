import {
	clienteController,
	contratoController,
	representanteController,
	TemplateController
} from '$lib/server/db/controllers';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const clientes = await clienteController.selectAllClientes();
	const representantes = await representanteController.selectAllRepresentantes();
	const templates = await TemplateController.selectAllTemplates();
	return { clientes, representantes, templates };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
        console.log('teste 1')
		const formData = await event.request.formData();
		const contratoNome = formData.get('contratoNome') as string;
		const dataVencimento = formData.get('dataVencimento') as string;
		// const representante_id = Number(formData.get('representanteId'));
        const cliente_id = Number(formData.get('cliente_id'));
        const descricao = formData.get('descricao') as string
		const valorPagamento = Number(formData.get('valorPagamento'));
        const servicosIds = formData.getAll('servicosIds').map(Number);

		if (!contratoNome || !dataVencimento || isNaN(valorPagamento) || valorPagamento <= 0) {            console.error('Campos obrigatorios')
			return fail(400, {
				message: 'Campos obrigatorios'
			});
		}

        // try {
            await contratoController.insertContrato({
                date_expire: new Date(dataVencimento),
                cliente_id: cliente_id,
                date_emission: new Date(),
                descricao: descricao,
                nome: contratoNome,
				valor_pagamento: valorPagamento, 
                status_pagamento: 'pendente'
                // representante_id: representante_id
            },servicosIds);
            console.log('success')
			
			return {
				success: true,
				message: 'Sucesso ao criar!'
			}
            redirect(302, '/admin/contratos');
            
        // } catch (error:any) {
        //     console.error(error.message)
        //     return {
		// 		success: false,
		// 		message: 'Falha ao criar'
		// 	}
        // }


	}
};
