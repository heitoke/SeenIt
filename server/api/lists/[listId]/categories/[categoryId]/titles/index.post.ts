import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

// * Types
import type { TMDBTitleInSearch } from '~~/types/tmdb';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);

    const categoryId = Number(await getRouterParam(event, 'categoryId'));
    
    const { titles: bodyTitles, liked = false } = await readBody(event) as { titles: Array<TMDBTitleInSearch>, liked?: boolean };

    const result = [];

    console.log(bodyTitles)
    for (const title of bodyTitles) {
        const { data, error } = await client.from('titles')
            .upsert({
                category_id: categoryId,
                title_id: title.id,
                data: title,
                liked
            })
            .select();
        
        result.push(error ? error : data[0]);
    }

    return result;
});