/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '$lib/server/db';
import { sessionTable, userTable } from '$lib/server/db/schema/user';
import { eq } from 'drizzle-orm';
import type { InsertUser, SelectUser } from '.';

async function insertUser(data: InsertUser) {
	return db.insert(userTable).values(data).run()
}

async function updateUser(id: string, data: Partial<SelectUser>) {
	return db.update(userTable).set(data).where(eq(userTable.id, id));
}
async function selectAllUsers() {
	return db.select().from(userTable);
}

async function getUserByEmail(email: string) {
	return db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
}
async function getSessions (userId: SelectUser['id']) {
    return db.select().from(sessionTable).where(eq(sessionTable.userId, userId))
}

async function getUserSession (userId: SelectUser['id']) {
    return db.select().from(userTable).where(eq(userTable.id, userId))
}



export const userController = {
	insertUser,
	selectAllUsers,
	getUserByEmail,
	getSessions,
	getUserSession,
	updateUser
};
