import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';

import type { Actions,PageServerLoad } from './$types';
import { userController } from '$lib/server/db/controllers';

// export const load: PageServerLoad = async (event) => {
// 	if (!event.locals.user) redirect(302, "/login");
// 	return {
// 		username: event.locals.user.username
// 	};
// };

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (
			typeof email !== 'string' ||
			email.length < 3 ||
			email.length > 255 ||
			!/.+@.+/.test(email)
		) {
			return fail(400, {
				message: 'Email inválido'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Senha inválida'
			});
		}
        
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Email ou senha inválidos'
			});
		}

		const [existingUser] = await userController.getUserByEmail(email);
		if (!existingUser) {
			return fail(400, {
				message: 'Nome de usuario ou senha inválidos'
			});
		}

        const validPassword = await verify(existingUser.password_hash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, {
				message: 'Nome de usuario ou senha inválidos'
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	},
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
	}
};
