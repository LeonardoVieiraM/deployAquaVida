import { db } from '$lib/server/db';
import { gerenteTable } from '$lib/server/db/schema/gerente';
import type { InsertGerente, SelectGerente } from '$lib/server/db/schema/gerente';
import { eq } from 'drizzle-orm';

async function insertGerente(data: InsertGerente) {
    return db.insert(gerenteTable).values(data).returning();
}

async function selectGerenteById(id: number) {
    return db.select().from(gerenteTable).where(eq(gerenteTable.id, id));
}

async function selectGerenteByUserId(userId: string) {
    return db.select().from(gerenteTable).where(eq(gerenteTable.userId, userId)).limit(1);
}

async function selectAllGerentes() {
    return db.select().from(gerenteTable);
}

async function updateGerente(id: number, data: Partial<SelectGerente>) {
    return db.update(gerenteTable).set(data).where(eq(gerenteTable.id, id));
}

export const gerenteController = {
    insertGerente,
    selectGerenteById,
    selectGerenteByUserId, 
    selectAllGerentes,
    updateGerente,
};