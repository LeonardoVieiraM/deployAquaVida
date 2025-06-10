import { db } from '$lib/server/db';
import { templateTable } from '$lib/server/db/schema/template';
import type { InsertTemplate, SelectTemplate } from '$lib/server/db/schema/template';
import { eq } from 'drizzle-orm';
import { servicoTable } from '../servico';

async function insertTemplate(data: InsertTemplate) {
	return db.insert(templateTable).values(data);
}

async function selectTemplateById(id: number) {
	return db.select().from(templateTable).where(eq(templateTable.servico_id, id));
}

async function selectAllTemplates() {
	return db.select().from(templateTable).leftJoin(servicoTable,eq(templateTable.servico_id,servicoTable.id));
}
async function updateTemplate(id: number, data: Partial<SelectTemplate>) {
	return db.update(templateTable).set(data).where(eq(templateTable.servico_id, id));
}

async function deleteTemplate(id: number) {
	return db.delete(templateTable).where(eq(templateTable.servico_id, id));
}
async function getTemplateByServicoId(servicoId:number){
	return db.select().from(templateTable).where(eq(templateTable.servico_id,servicoId))
}

export const TemplateController = {
	insertTemplate,
	selectTemplateById,
	selectAllTemplates,
	updateTemplate,
	deleteTemplate,
	getTemplateByServicoId
};
