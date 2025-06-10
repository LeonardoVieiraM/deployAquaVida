import { db } from '$lib/server/db';
import { contratoTable } from '$lib/server/db/schema/contrato';
import type { InsertContrato, SelectContrato } from '$lib/server/db/schema/contrato';
import { eq } from 'drizzle-orm';
import { representanteTable } from '../representante';
import { clienteTable } from '../cliente';
import { servicoToContratoTable } from '../servico';
import { relatorioTable } from '../relatorio';

async function insertContrato(data: InsertContrato, servicoIds: number[]) {
	const [contrato] = await db.insert(contratoTable).values(data).returning();

	for(const id of servicoIds) {
		await db
			.insert(servicoToContratoTable)
			.values({ contrato_id: contrato.id, servico_id: id, status: 'Pendente' });
	}
	return { contrato };
}

async function selectContratoById(id: number) {
	return db.query.contratoTable.findFirst({
        where: eq(contratoTable.id,id),
        with:{
            servico: {
				with: {
					servico:true
				}
			}
        },
    })
}


async function selectContratoByIdClientRepresentante(id: number) {
	return db
		.select()
		.from(contratoTable)
		.where(eq(contratoTable.id, id))
		.leftJoin(clienteTable, eq(clienteTable.id, contratoTable.cliente_id))
		.leftJoin(representanteTable, eq(clienteTable.representante_id, representanteTable.id))
		.leftJoin(relatorioTable,eq(relatorioTable.contrato_id,contratoTable.id))
}

async function selectContratoByIdClientRepresentante2(id: number) {
	return db.query.contratoTable.findFirst({
		where:eq(contratoTable.id,id),
		with:{
			relatorio:true,
			cliente:{
				with:{
					representante: true
				}
			}
		}
	})
}

async function selectContratoByClienteId(id: number) {
	return db.select().from(contratoTable).where(eq(contratoTable.cliente_id, id));
}

async function selectAllContratos() {
	return db.select().from(contratoTable);
}

async function selectAllContratosWithRepresentante() {
	return db
		.select()
		.from(contratoTable)
		.leftJoin(clienteTable, eq(clienteTable.id, contratoTable.cliente_id));
}

async function updateContrato(id: number, data: Partial<SelectContrato>) {
	return db.update(contratoTable).set(data).where(eq(contratoTable.id, id));
}

async function deleteContrato(id: number) {
	return db.delete(contratoTable).where(eq(contratoTable.id, id));
}
export const contratoController = {
	insertContrato,
	selectContratoById,
	selectAllContratos,
	updateContrato,
	deleteContrato,
	selectContratoByClienteId,
	selectAllContratosWithRepresentante,
	selectContratoByIdClientRepresentante,
	selectContratoByIdClientRepresentante2
};
