
import { servicoController } from '$lib/server/db/controllers';
import { TemplateController } from '$lib/server/db/schema/template/controller';
import type { PageServerLoad,Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
	const servicos = await servicoController.selectAllServicos();
	const templates = await TemplateController.selectAllTemplates();
	return { servicos, templates };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const data = await request.formData();
			const servicoId = Number(data.get('servico_id'))
			const description = String(data.get('description'));
	
			// const [existingTemplate] = await TemplateController.getTemplateByServicoId(servicoId);
			// console.log(existingTemplate)
			// if (!existingTemplate) {
			// 	return fail(400, {
			// 		message: 'Já existe um template desse serviço ou nenhum selecionado'
			// 	});
			// }
			if(!description){
				return fail(400, {
					message: 'É obrigatorio descrição'
				});
			}
	
			await TemplateController.insertTemplate({ descricao:description,servico_id:servicoId });
			return {
				success: true,
				message: 'Template criado com sucesso!'
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Ocorreu um erro ao criar, é possivel que já exista um template com esse serviço'
			}
		}
	},
	update: async({request})=>{
		try {
			const data = await request.formData();
			const id = Number(data.get('servico_id'))
			const description = String(data.get('description'));
	
			await TemplateController.updateTemplate(id,{ descricao:description,servico_id:id });
			return {
				success: true,
				message: 'Template editado com sucesso!'
			}
		} catch (error) {
			console.error(error)
			return {
				success: false,
				message: 'Falha ao criar'
			}
		}
	}
};
