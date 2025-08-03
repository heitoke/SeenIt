import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const listId = await getRouterParam(event, 'listId');

    const { name } = await readBody(event) as { name: string };

    const { data, error } = await client.from('lists')
        .update({
            name
        })
        .eq('id', listId)
        .select('id, name, created_at')
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});