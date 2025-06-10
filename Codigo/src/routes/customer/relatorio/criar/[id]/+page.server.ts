import { clienteController, contratoController, relatorioController, servicoController } from '$lib/server/db/controllers';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { enumStatusServico, type StatusType } from '$lib/server/db/schema';

export const load = (async ({params}) => {
	const id = Number(params.id)
        
	// // const relatorios = await relatorioController.selectRelatorioById(id);
	const contrato = await contratoController.selectContratoById(id)
   
	// const servicos = await servicoController.selectAllServicos();

	const servicos = await servicoController.selectAllServicos();
	return { contrato ,servicos};
}) satisfies PageServerLoad;

export const actions: Actions = {
	
	create:async(event)=>{
		const formData= await event.request.formData()

		const nome = formData.get('nome');
		const descricao = formData.get('descricao');
		const id = Number(formData.get('id'))
		console.log(formData)

		if (!nome || typeof nome !== 'string') {
			return fail(400, { message: 'Digite um nome' });
		}
		if (!descricao || typeof descricao !== 'string') {
			return fail(400, { message: 'Escolha uma descricao' });
		}

		const result = await relatorioController.insertRelatorio({contrato_id:id,descricao:descricao,nome})

		console.log(result)

		redirect(302, `/customer/contratos/${id}`)
		
		return {
			success: true,
            message: "Relatorio criado com sucesso!"
        };
	},
	solicitar: async (event) => {
		const formData = await event.request.formData();
		const servicoId = formData.get('servico');
		const clienteId = Number(formData.get('clienteId'))
		console.log(formData)


		if (!servicoId || typeof servicoId !== 'string') {
			return fail(400, { message: 'Por favor, selecione um serviço.' });
		}

		const servico_id = Number(servicoId);

		await clienteController.insertPedido({
			description: String('Recomendação do Representante'),
			status: 'pendente',
			servico_id: servico_id,
			cliente_id: clienteId
		});
		return {
            success: true,
            message: "Solitação de novo serviço enviada!"
        };
	},
	status:async (event)=>{
		try {
			const formData = await event.request.formData()
			const statusRaw = formData.get('status')
			const contratoId= Number(formData.get('contratoID'))
	
			console.log(formData)

			if (typeof statusRaw !== 'string') {
				throw new Error('O status deve ser uma string válida.');
			  }

			  const status = statusRaw as string;

			if (!enumStatusServico.includes(status as StatusType)) {
				return {
				  success: false,
				  message: `Status inválido: ${status}. Os status válidos são: ${enumStatusServico.join(', ')}`,
				};
			  }

			const validStatus = status as StatusType;
			console.log(contratoId)

			const result = await relatorioController.updateServicoToContrato(
				{ status: validStatus },
				contratoId
			  );
			
			  console.log(result);
	
			return {
				success:true,
				message:'Sucesso ao atualizar status!'
			}
			
		} catch (error) {
			console.error(error)
			return {
				success:false,
				message:'Erro ao atualizar status!'
			}
		}
	}
};
