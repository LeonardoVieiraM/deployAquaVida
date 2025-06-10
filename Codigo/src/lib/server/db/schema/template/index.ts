import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { servicoTable } from '../servico';

export const templateTable = sqliteTable('template', {
	servico_id: integer('servico_id')
		.notNull()
		.primaryKey()
		.references(() => servicoTable.id),
	descricao: text('descricao')
});

export const templateRelations = relations(templateTable, ({ many, one }) => ({
	servico: one(servicoTable, {
		fields: [templateTable.servico_id],
		references: [servicoTable.id]
	})
}));

export type SelectTemplate = typeof templateTable.$inferSelect;
export type InsertTemplate = typeof templateTable.$inferInsert;
