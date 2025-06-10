import {
  eventController,
  clienteController,
  representanteController,
  servicoController
} from '$lib/server/db/controllers';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { user, session } = locals;

  if (!user || !session) {
    return redirect(302, '/login');
  }

  // Determinar o tipo de usuário
  const userId = user.id;
  const userType = 'gerente';

  // Carregar eventos de acordo com o tipo de usuário
  let dbEvents;
  if (userType === 'gerente') {
    dbEvents = await eventController.selectAllEvents();
  } else {
    dbEvents = await eventController.selectEventsByUser(Number(userId), userType);
  }

  const clientes = await clienteController.selectAllClientes();
  const representantes = await representanteController.selectAllRepresentantes();
  const servicos = await servicoController.selectAllServicos();

  const clienteMap = new Map(clientes.map((cliente) => [cliente.id, cliente.name]));
  const representanteMap = new Map(representantes.map((rep) => [rep.id, rep.name]));

  const events = dbEvents.map((event) => ({
    id: event.id.toString(),
    title: event.titulo,
    start: event.data.toISOString(),
    cliente_id: event.cliente_id,
    cliente_name: event.cliente_id !== null ? clienteMap.get(event.cliente_id) || 'Desconhecido' : 'Desconhecido',
    representante_id: event.representante_id,
    representante_name: event.representante_id !== null ? representanteMap.get(event.representante_id) || 'Desconhecido' : 'Desconhecido',
    local: event.local,
    descricao: event.descricao
  }));

  return {
    events,
    clientes,
    representantes,
    servicos,
    user,
    session
  };
};


export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const titulo = formData.get('titulo') as string;
    const local = formData.get('local') as string;
    const dataStr = formData.get('data') as string;
    const descricao = formData.get('descricao') as string;
    const representante_id = Number(formData.get('representante_id'));
    const cliente_id = Number(formData.get('cliente_id'));

    if (!titulo || !local || !dataStr || isNaN(representante_id) || isNaN(cliente_id)) {
      return fail(400, { error: 'Campos obrigatórios ausentes ou inválidos.' });
    }

    const data = new Date(dataStr);
    if (isNaN(data.getTime())) {
      return fail(400, { error: 'Data inválida.' });
    }

    await eventController.insertEvent({
      titulo,
      local,
      data,
      descricao,
      representante_id,
      cliente_id
    });

    throw redirect(303, '/admin/calendarTodos');
  },

  update: async ({ request }) => {
    const formData = await request.formData();

    const id = Number(formData.get('id'));
    const titulo = formData.get('titulo') as string;
    const local = formData.get('local') as string;
    const descricao = formData.get('descricao') as string | null;
    const dataStr = formData.get('data') as string;
    const representante_id = Number(formData.get('representante_id'));
    const cliente_id = Number(formData.get('cliente_id'));

    if (isNaN(id) || id <= 0 || !titulo || !local || !dataStr || isNaN(representante_id) || isNaN(cliente_id)) {
      return fail(400, { error: 'Campos obrigatórios ausentes ou inválidos.' });
    }

    const data = new Date(dataStr);
    if (isNaN(data.getTime())) {
      return fail(400, { error: 'Data inválida.' });
    }

    try {
      await eventController.updateEvent(id, {
        titulo,
        local,
        data,
        descricao,
        representante_id,
        cliente_id
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return fail(500, { error: 'Erro interno ao atualizar o evento.' });
    }

    throw redirect(303, '/admin/calendarTodos');
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = Number(formData.get('id'));
    if (isNaN(id) || id <= 0) {
      return fail(400, { error: 'ID do evento é obrigatório e deve ser um número válido.' });
    }

    try {
      await eventController.deleteEvent(id);
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      return fail(500, { error: 'Erro interno ao excluir o evento.' });
    }

    throw redirect(303, '/admin/calendarTodos');
  }
};
