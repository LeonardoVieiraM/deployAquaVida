import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { contratoTable } from '../contrato';
import { pedidosClienteTable } from '../cliente';
import { templateTable } from '../template';

export const servicoTable = sqliteTable('servico', {
	id: integer('id').notNull().primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description').notNull(),
});

export const servicoRelations = relations(servicoTable, ({ many, one }) => ({
	contrato: many(servicoToContratoTable),
	pedidos: many(servicoToPedidoTable),
	// relatorio: many(relatorioTable),
	template: one(templateTable, {
		fields: [servicoTable.id],
		references: [templateTable.servico_id]
	}),
}));

//TODO: Relation com relatorio e template

export const enumStatusServico = ['Em Andamento', 'Concluido', 'Não Iniciado', 'Pendente', 'Recusado'] as const

export type StatusType = typeof enumStatusServico[number]

export const servicoToContratoTable = sqliteTable('servico_to_contrato', {
	servico_id: integer('servico_id')
		.notNull()
		.references(() => servicoTable.id),
	contrato_id: integer('contrato_id')
		.notNull()
		.references(() => contratoTable.id),
		
	status: text('status', { enum: enumStatusServico }),

});
export const servicoToContratoRelations = relations(servicoToContratoTable, ({ one }) => ({
	servico: one(servicoTable, {
		fields: [servicoToContratoTable.servico_id],
		references: [servicoTable.id]
	}),
	contrato: one(contratoTable, {
		fields: [servicoToContratoTable.contrato_id],
		references: [contratoTable.id]
	})
}));


export type SelectServicoToContrato = typeof servicoToContratoTable.$inferSelect;
export type InsertServicoToContrato = typeof servicoToContratoTable.$inferInsert;


export const servicoToPedidoTable = sqliteTable('servico_to_pedido', {
	servico_id: integer('servico_id')
		.notNull()
		.references(() => servicoTable.id),
	pedido_id: integer('pedido_id').references(() => pedidosClienteTable.id)
});

export const servitoToPedidoRelations = relations(servicoToPedidoTable, ({ one }) => ({
	servico: one(servicoTable, {
		fields: [servicoToPedidoTable.servico_id],
		references: [servicoTable.id]
	}),
	pedido: one(pedidosClienteTable, {
		fields: [servicoToPedidoTable.pedido_id],
		references: [pedidosClienteTable.id]
	})
}));

export type SelectServico = typeof servicoTable.$inferSelect;
export type InsertServico = typeof servicoTable.$inferInsert;
