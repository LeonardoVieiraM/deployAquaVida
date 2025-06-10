import { relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { representanteTable } from '../representante';
import { userTable } from '../user'; // Importe a userTable

export const gerenteTable = sqliteTable('gerente', {
    id: integer('id').notNull().primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }), // Vincula ao user
    name: text('name').notNull(),
    estado: text('estado').notNull(),
});

export const gerenteRelations = relations(gerenteTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [gerenteTable.userId],
        references: [userTable.id]
    }),
    representante: many(representanteTable)
}));

export type SelectGerente = typeof gerenteTable.$inferSelect;
export type InsertGerente = typeof gerenteTable.$inferInsert;