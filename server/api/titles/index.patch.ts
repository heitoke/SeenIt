import { createError } from 'h3';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

// * Types
import type { Database } from '~~/types/database.types';
import type { List } from '~~/types/list';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const listId = await getRouterParam(event, 'listId');

    const { name, private: privateMode } = await readBody(event) as Pick<List, 'name' | 'private'>;

    const { data, error } = await client.from('lists')
        .update({
            name,
            private: privateMode
        })
        .eq('id', listId)
        .select('id, name, created_at')
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});