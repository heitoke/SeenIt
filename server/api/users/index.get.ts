import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

// * Types
import type { User } from '~~/types/user';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.rpc('get_users_with_auth');

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data as Array<User>;
});