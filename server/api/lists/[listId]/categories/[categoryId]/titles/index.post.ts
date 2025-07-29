import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const categoryId = Number(await getRouterParam(event, 'categoryId'));
    
    const { data: bodyData, liked = false } = await readBody(event) as { data: TMDBTitleInSearch, liked?: boolean };

    const { data, error } = await client.from('titles')
        .upsert({
            category_id: categoryId,
            title_id: bodyData?.id,
            data: bodyData,
            liked
        })
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});