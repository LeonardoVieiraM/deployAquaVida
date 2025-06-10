import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { representanteTable } from '../representante';
import { clienteTable } from '../cliente';

export const eventoTable = sqliteTable('evento', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  data: integer('data', { mode: 'timestamp' }).notNull(),
  titulo: text('titulo').notNull(),
  local: text('local').notNull(),
  descricao: text('descricao'),
  representante_id: integer('representante_id').references(() => representanteTable.id),
  cliente_id: integer('cliente_id').references(() => clienteTable.id),
});

export const eventoRelations = relations(eventoTable, ({ one }) => ({
  representante: one(representanteTable, {
    fields: [eventoTable.representante_id],
    references: [representanteTable.id],
  }),
  cliente: one(clienteTable, {
    fields: [eventoTable.cliente_id],
    references: [clienteTable.id],
  }),
}));

export type SelectEvent = typeof eventoTable.$inferSelect; 
export type InsertEvent = typeof eventoTable.$inferInsert; 