import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { gerenteTable } from '../gerente';
import { clienteTable } from '../cliente';
import { contratoTable } from '../contrato';

export const representanteTable = sqliteTable('representante', {
	id: integer('id').notNull().primaryKey({ autoIncrement: true }),
	name: text('name'),
	email: text('email'),
	cpf: text('cpf').notNull(),
	gerente_id: integer('gerente_id').references(() => gerenteTable.id)
});

export const representanteRelations = relations(representanteTable, ({ one, many }) => ({
	cliente: many(clienteTable),
	// contratoTable: many(contratoTable),
	gerente: one(gerenteTable, {
		fields: [representanteTable.gerente_id],
		references: [gerenteTable.id]
	})
}));

export type SelectRepresentante = typeof representanteTable.$inferSelect;
export type InsertRepresentante = typeof representanteTable.$inferInsert;
