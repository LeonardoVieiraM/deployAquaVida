import { clienteController, gerenteController, representanteController } from '$lib/server/db/controllers';
import { fail, redirect } from '@sveltejs/kit'; 
import type { PageServerLoad, Actions } from './$types';
import type { AppUser } from '$lib/types';

export const load = (async ({ locals }) => {
    const { user, session } = locals;

    if (!user || !session || (user as AppUser).tipo !== 'gerente') {
        throw redirect(302, '/login'); 
    }

    const [gerente] = await gerenteController.selectGerenteByUserId(user.id);
    if (!gerente) {
        throw new Error('Gerente não encontrado');
    }

    const representantes = await representanteController.selectRepresentantesByGerenteId(gerente.id);
    const clientes = await clienteController.selectAllClientes();

    return { representantes, clientes };
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request, locals }) => {
        try {
            const data = await request.formData();
            const name = String(data.get('name'));
            const cpf = String(data.get('cpf'));
            if (!cpf) {
                return fail(400, {
                    message: 'Digite um CPF'
                });
            }

            const [gerente] = await gerenteController.selectGerenteByUserId((locals.user as AppUser).id);
            if (!gerente) {
                return fail(400, {
                    message: 'Gerente não encontrado'
                });
            }

            await representanteController.insertRepresentante({ name, cpf, gerente_id: gerente.id });

            return {
                success: true,
                message: 'Representante criado com sucesso!'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Falha ao criar'
            };
        }
    },
    delete: async ({ request }) => {
        try {
            const data = await request.formData();
            const id = Number(data.get('id'));

            await representanteController.deleteRepresentante(id);

            return {
                success: true,
                message: 'Representante deletado com sucesso!'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Falha ao deletar'
            };
        }
    },
    update: async ({ request }) => {
        try {
            const data = await request.formData();
            const id = Number(data.get('id'));
            const name = String(data.get('name'));

            await representanteController.updateRepresentante(id, { name });
            return {
                success: true,
                message: 'Representante editado com sucesso!'
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Falha ao atualizar'
            };
        }
    }
};