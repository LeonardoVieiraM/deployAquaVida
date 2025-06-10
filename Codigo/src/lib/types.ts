import type { SelectUser } from '$lib/server/db/schema/user';

declare module 'lucia' {
    interface Register {
        Lucia: typeof import('$lib/server/auth').lucia;
        DatabaseUserAttributes: Omit<SelectUser, 'id'> & { id?: never };
    }
}

export type AppUser = SelectUser;