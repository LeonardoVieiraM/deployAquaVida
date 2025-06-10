import { db } from '$lib/server/db';
import { eventoTable } from '$lib/server/db/schema/evento';
import type { InsertEvent, SelectEvent } from '$lib/server/db/schema/evento';
import { eq } from 'drizzle-orm';

async function insertEvent(data: InsertEvent) {
  return db.insert(eventoTable).values(data);
}

async function selectEventsByUser(userId: number, userType: 'representante' | 'cliente') { 
  let condition;
  switch (userType) {
    case 'representante':
      condition = eq(eventoTable.representante_id, userId);
      break;
    case 'cliente':
      condition = eq(eventoTable.cliente_id, userId);
      break;
    default:
      throw new Error('Invalid user type');
  }

  return db.select().from(eventoTable).where(condition);
}

async function selectAllEvents() {
  return db.select().from(eventoTable);
}

async function updateEvent(id: number, data: Partial<SelectEvent>) {
  return db.update(eventoTable).set(data).where(eq(eventoTable.id, id));
}

async function deleteEvent(id: number) {
  return db.delete(eventoTable).where(eq(eventoTable.id, id));
}

export const eventController = {
  insertEvent,
  selectEventsByUser,
  selectAllEvents,
  updateEvent,
  deleteEvent,
};