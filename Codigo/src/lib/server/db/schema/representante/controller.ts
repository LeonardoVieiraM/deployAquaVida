import { db } from '$lib/server/db';
import { representanteTable } from '$lib/server/db/schema/representante';
import type { InsertRepresentante, SelectRepresentante } from '$lib/server/db/schema/representante';
import { eq } from 'drizzle-orm';
import { sessionTable, userTable } from '../user';
import { fromJSON } from 'postcss';
import { clienteTable } from '../cliente';
import { userController } from '../user/controller';

async function insertRepresentante(data: InsertRepresentante) {
	return db.insert(representanteTable).values(data);
}

async function selectRepresentantesByGerenteId(gerenteId: number) {
    return db.select().from(representanteTable).where(eq(representanteTable.gerente_id, gerenteId));
}

async function selectRepresentanteById(id: number) {
	return db.select().from(representanteTable).where(eq(representanteTable.id, id));
}

async function selectAllRepresentantes() {
	return db.select().from(representanteTable);
}

async function getRepresentanteByCPF(cpf: string) {
	const representantes = await db.select().from(representanteTable).where(eq(representanteTable.cpf, cpf)).limit(1);
	return representantes.length > 0 ? representantes[0] : null;
}

async function getRepresentanteByEmail(email: string) {
	return db.select().from(representanteTable).where(eq(representanteTable.email, email)).limit(1);
}

async function updateRepresentante(id: number, data: Partial<SelectRepresentante>) {
	return db.update(representanteTable).set(data).where(eq(representanteTable.id, id));
}

async function deleteRepresentante(id: number) {
	return db.delete(representanteTable).where(eq(representanteTable.id, id));
}

async function selectClientesByRepresentante(id:string) {
    const user = await userController.getUserSession(id);

    const representante = await selectRepresentanteByUserMail(user[0].email);
    if (!representante || representante.length === 0) {
        console.error('Nenhum representante');
        throw new Error('Nenhum representante');
    }

    const clientes = await selectClientesByRepresentanteId(representante[0].id)
    return clientes;
}

async function selectRepresentanteByUserId(id:string) {
    const user = await userController.getUserSession(id);

    const representante = await selectRepresentanteByUserMail(user[0].email);
    if (!representante || representante.length === 0) {
        console.error('Nenhum representante');
        throw new Error('Nenhum representante');
    }
    return representante;
}

async function selectRepresentanteByUserMail(email:string) {
	return db.select().from(representanteTable).where(eq(representanteTable.email,email));
}
async function selectClientesByRepresentanteId(id:number){
	return db.select().from(clienteTable).where(eq(clienteTable.representante_id,id));
}

export const representanteController = {
	insertRepresentante,
	selectRepresentanteById,
	selectAllRepresentantes,
	updateRepresentante,
	deleteRepresentante,
	getRepresentanteByCPF,
	getRepresentanteByEmail,
	selectClientesByRepresentante,
	selectRepresentantesByGerenteId,
	selectClientesByRepresentanteId,
	selectRepresentanteByUserId,
	selectRepresentanteByUserMail
};
