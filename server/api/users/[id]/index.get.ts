import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

// * Types
import type { User } from '~~/types/user';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const userId = getRouterParam(event, 'id');

    const { data, error } = await client.rpc('get_user_by_id', { user_id: userId });

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data as User;
});