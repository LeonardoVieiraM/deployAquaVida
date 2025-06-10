import { relations, sql } from 'drizzle-orm';
import { servicoTable } from '../servico'; // Ajuste o caminho conforme necessário
import { representanteTable } from '../representante';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { contratoTable } from '../contrato';

export const relatorioTable = sqliteTable('relatorio', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // status: text('status').notNull(),
    // InclusaoServico: integer('InclusaoServico').notNull(),
    descricao: text('descricao'),
    nome: text('nome'),
    // servico_ID: integer('servico_ID').references(() => servicoTable.id),
    // representante_ID: integer('representante_ID').references(() => representanteTable.id),
    contrato_id: integer('contrato_id').references(() => contratoTable.id),
    created_at:text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Relações
export const relatorioRelations = relations(relatorioTable, ({ one }) => ({
    // servico: one(servicoTable),
    // representante: one(representanteTable),
    contrato: one(contratoTable,{
        fields:[relatorioTable.contrato_id],
        references:[contratoTable.id]
    })
}));

export type SelectRelatorio = typeof relatorioTable.$inferSelect;
export type InsertRelatorio = typeof relatorioTable.$inferInsert;
    