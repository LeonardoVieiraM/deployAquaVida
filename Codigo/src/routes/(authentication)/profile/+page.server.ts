import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { clienteController, representanteController, userController } from '$lib/server/db/controllers';

export const load = (async ({locals}) => {
	const user = locals.user
	if (!locals.session) {
		return fail(401);
	}

	if(!user){
		return fail(401);
	}
	const cli = await clienteController.getClienteByEmail(user?.email)
	if(cli){
		const cliente = await clienteController.selectClienteById(cli.id)
		console.log(cliente)
		return {cliente};
	} else{
		return {}
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login');
	},
	update: async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }

		
        const formData = await event.request.formData();
        const userId = event.locals.session.userId;
        const updatedData = {
			username: String(formData.get('name')),
            email: String(formData.get('cnpj'))
        };

		const user = await userController.getUserSession(userId)
		const cliente = await clienteController.getClienteByEmail(user[0].email)
		const representante = await representanteController.selectRepresentanteByUserMail(user[0].email)

		if(user[0].tipo === 'cliente') {
			await clienteController.updateCliente(cliente.id,updatedData)
		}
		if(user[0].tipo === 'representante') {
			await representanteController.updateRepresentante(representante[0].id,updatedData)
		}
		
        await userController.updateUser(userId, updatedData);

        return {
            success: true,
            message: "Profile updated successfully!"
        };
    }
};
