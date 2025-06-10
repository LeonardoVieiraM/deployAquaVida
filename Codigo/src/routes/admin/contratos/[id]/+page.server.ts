import { contratoController } from '$lib/server/db/controllers';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ params, locals }) => {
    const { user } = locals;
    
    // Redirect if not authenticated or not gerente
    if (!user || user.tipo !== 'gerente') {
        throw redirect(302, '/login');
    }

    const id = Number(params.id);
    const contrato = await contratoController.selectContratoByIdClientRepresentante2(id);

    if (!contrato) {
        throw redirect(302, '/admin/contratos');
    }

    return { contrato };
}) satisfies PageServerLoad;

export const actions: Actions = {
    update: async ({ request, locals }) => {
        const { user } = locals;
        if (!user || user.tipo !== 'gerente') {
            return fail(403, { message: 'Não autorizado' });
        }

        const formData = await request.formData();
        const contratoId = Number(formData.get('contratoId'));
        const dataVencimento = formData.get('dataVencimento') as string;
        const descricao = formData.get('descricao') as string;
        const valorPagamento = Number(formData.get('valorPagamento'));

        try {
            await contratoController.updateContrato(contratoId, {
                date_expire: new Date(dataVencimento),
                descricao: descricao,
                valor_pagamento: valorPagamento
            });

            return {
                success: true,
                message: 'Contrato atualizado com sucesso!'
            };
        } catch (error) {
            console.error('Error updating contract:', error);
            return fail(500, {
                message: 'Erro ao atualizar contrato'
            });
        }
    }
};