import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessionTable, userTable } from './db/schema/user';
import type { AppUser } from '$lib/types';

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev
        }
    },
    getUserAttributes: (attributes: Omit<AppUser, 'id'>) => {
        return {
            username: attributes.username,
            email: attributes.email,
            tipo: attributes.tipo
        };
    }
});