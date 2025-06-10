import { representanteController, servicoController } from "$lib/server/db/controllers";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const servicos = await servicoController.selectAllServicos();
	return { servicos };
}) satisfies PageServerLoad;