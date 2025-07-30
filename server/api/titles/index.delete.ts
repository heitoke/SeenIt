import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);
    
    const { ids } = await readBody(event) as { ids: Array<number> };

    const { data, error } = await client.from('titles')
        .delete()
        .in('id', ids);

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return {
        success: true
    };
});