import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const categoryId = getRouterParam(event, 'categoryId');

    const { data, error } = await client.from('titles').select().eq('category_id', categoryId);

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});