import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { representanteTable } from '../representante';
import { contratoTable } from '../contrato';
import { servicoTable, servicoToPedidoTable } from '../servico';
import { gerenteTable } from '../gerente';

export const clienteTable = sqliteTable('cliente', {
	id: integer('id').notNull().primaryKey({ autoIncrement: true }),
	cnpj: text('cnpj').notNull(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	endereco: text('endereco'),
	representante_id: integer('representante_id').references(() => representanteTable.id)
});

export const clienteRelations = relations(clienteTable, ({ one,many }) => ({
	representante: one(representanteTable, {
		fields: [clienteTable.representante_id],
		references: [representanteTable.id]
	}),
	contrato: many(contratoTable)
}));

export type SelectCliente = typeof clienteTable.$inferSelect;
export type InsertCliente = typeof clienteTable.$inferInsert;

export const pedidosClienteTable = sqliteTable('pedidos', {
	id: integer('id').notNull().primaryKey({ autoIncrement: true }),
	status: text('status', { enum: ['pendente', 'aderido', 'recusado'] }).notNull(),
	description: text('description'),
	cliente_id: integer('cliente_id').references(() => clienteTable.id),
	gerente_id: integer('gerente_id').references(() => gerenteTable.id),
	servico_id: integer('servico_id').references(() => servicoTable.id)
});

export const pedidosClienteRelations = relations(pedidosClienteTable, ({ one, many }) => ({
	gerente: one(gerenteTable, {
		fields: [pedidosClienteTable.gerente_id],
		references: [gerenteTable.id]
	}),
	cliente: one(clienteTable, {
		fields: [pedidosClienteTable.cliente_id],
		references: [clienteTable.id]
	}),
	servico: many(servicoToPedidoTable)
}));

export type SelectPedido = typeof pedidosClienteTable.$inferSelect;
export type InsertPedido = typeof pedidosClienteTable.$inferInsert;
