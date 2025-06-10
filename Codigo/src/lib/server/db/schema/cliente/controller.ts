import { db } from '$lib/server/db';
import { clienteTable, pedidosClienteTable } from '$lib/server/db/schema/cliente';
import type {
	InsertCliente,
	InsertPedido,
	SelectCliente,
	SelectPedido
} from '$lib/server/db/schema/cliente';
import { eq } from 'drizzle-orm';
import { servicoTable } from '../servico';
import { representanteTable } from '../representante';
import { userController } from '../user/controller';

async function insertCliente(data: InsertCliente) {
	return db.insert(clienteTable).values(data);
}
async function selectClienteById(id: number) {
	return db.select().from(clienteTable).leftJoin(representanteTable,eq(representanteTable.id,clienteTable.representante_id)).where(eq(clienteTable.id, id));
}

async function getClienteByEmail(email: string) {
	const cliente = await db
		.select()
		.from(clienteTable)
		.where(eq(clienteTable.email, email))
		.limit(1);
	return cliente[0] || null;

}

async function selectAllClientes() {
	return db.select().from(clienteTable);
}

async function updateCliente(id: number, data: Partial<SelectCliente>) {
	return db.update(clienteTable).set(data).where(eq(clienteTable.id, id));
}

async function deleteCliente(id: number) {
	return db.delete(clienteTable).where(eq(clienteTable.id, id));
}

async function insertPedido(data: InsertPedido) {
	return db.insert(pedidosClienteTable).values(data);
}

async function selectAllPedidos() {
	return db
		.select()
		.from(pedidosClienteTable)
		.leftJoin(servicoTable, eq(servicoTable.id, pedidosClienteTable.servico_id))
		.leftJoin(clienteTable, eq(clienteTable.id, pedidosClienteTable.cliente_id));
}

async function updatePedido(id: number, data: Partial<SelectPedido>) {
	return db.update(pedidosClienteTable).set(data).where(eq(pedidosClienteTable.id, id));
}

async function associateRepresentanteToCliente(clienteId: number, representanteId: number) {
    return db
        .update(clienteTable)
        .set({ representante_id: representanteId })
        .where(eq(clienteTable.id, clienteId));
}

async function getClienteById(id: number) {
	const cliente = await selectClienteById(id);
	return cliente[0] || null;
}

async function selectClienteByUserId(id:string) {
	const user = await userController.getUserSession(id);

	const cliente = await getClienteByEmail(user[0].email);
	if (!cliente) {
		console.error('Nenhum representante');
		throw new Error('Nenhum representante');
	}
	return cliente;
}

export const clienteController = {
	insertCliente,
	selectClienteById,
	selectAllClientes,
	updateCliente,
	deleteCliente,
	insertPedido,
	selectAllPedidos,
	updatePedido,
	getClienteByEmail,
	associateRepresentanteToCliente,
	selectClienteByUserId,
	getClienteById
};
