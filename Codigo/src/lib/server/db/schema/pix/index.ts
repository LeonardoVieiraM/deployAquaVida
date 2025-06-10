import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const pixPaymentTable = sqliteTable('pix_payment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  paymentId: text('payment_id').notNull(),
  status: text('status').notNull(),
  statusDetail: text('status_detail'),
  qrCodeBase64: text('qr_code_base64').notNull(),
  qrCode: text('qr_code').notNull(),
  contratoId: integer('contrato_id').notNull(),
  amount: real('amount').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow()
});

export type SelectPixPayment = typeof pixPaymentTable.$inferSelect;
export type InsertPixPayment = typeof pixPaymentTable.$inferInsert;