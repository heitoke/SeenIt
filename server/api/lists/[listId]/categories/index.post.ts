import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const listId = getRouterParam(event, 'listId');
    
    const { name } = await readBody(event) as { name: string };

    const { data, error } = await client.from('categories')
        .upsert({
            list_id: listId,
            name,
        })
        .select('id, list_id, name, created_at')
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});