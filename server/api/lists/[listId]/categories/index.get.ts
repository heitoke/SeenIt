import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const listId = getRouterParam(event, 'listId');

    const { data, error } = await client.from('categories').select('id, list_id, name, created_at').eq('list_id', listId);

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});