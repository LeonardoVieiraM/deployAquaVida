import { servicoController } from '$lib/server/db/controllers';
import { relatorioController } from '$lib/server/db/schema/relatorio/controller';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({params}) => {
    // try {
        const id = Number(params.id)
        
        const relatorios = await relatorioController.selectRelatorioById(id);
       
        return {
            relatorios, 
        };
    // } catch (error) {
    //     console.error('Erro ao carregar os dados do relatório:', error);

    //     return {
    //         r: [],
    //     };
    // }
};
