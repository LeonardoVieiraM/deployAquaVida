import { db } from '$lib/server/db';
import { pixPaymentTable } from '$lib/server/db/schema/pix';
import type { InsertPixPayment, SelectPixPayment } from '$lib/server/db/schema/pix';

export const pixPaymentController = {
  async createPixPayment(data: InsertPixPayment) {
    return db.insert(pixPaymentTable).values(data).returning();
  },

  async getPixPayments() {
    return db.select().from(pixPaymentTable);
  },

  async getPixPaymentById(id: number) {
    return db.select().from(pixPaymentTable).where(eq(pixPaymentTable.id, id));
  },

  async updatePixPaymentStatus(id: number, status: string) {
    return db.update(pixPaymentTable)
      .set({ status })
      .where(eq(pixPaymentTable.id, id));
  }
};