import { servicoController, userController } from '$lib/server/db/controllers';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals, url }) => {
	const { session, user } = locals;

	const servicos = await servicoController.selectAllServicos()

	const [fullUser] = await userController.getUserByEmail(user?.email || '');

	return { session, user, transition_key: url.pathname, fullUser,servicos };
}) satisfies LayoutServerLoad;
