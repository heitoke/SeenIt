import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

// * Types
import { TMDBTitle } from '~~/types/tmdb';


interface Body {
    categoryId: number;
    titles: Array<{
        id: number;
        mediaType: 'movie' | 'tv';
    }>;
    language: string;
    liked: number;
}


export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);

    if (!$user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not auth'
        });
    }

    const client = await serverSupabaseClient<Database>(event);
    const config = useRuntimeConfig(event);

    const { categoryId, titles, language = 'en-US', liked = 0 } = await readBody(event) as Body;

    const { data: dataCategory, error: errorCategory } = await client.from('categories').select('*, list:lists (*)').eq('id', categoryId);

    if (errorCategory) {
        throw createError({ statusMessage: errorCategory.message });
    }

    const category = dataCategory[0];

    if (String(category.list.user_id) !== String($user?.app_metadata?.public_id)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You don\'t have enough rights'
        });
    }

    const listTitles: Array<TMDBTitle> = [];

    for (const { id, mediaType } of titles) {
        const { data: tmdbTitle, error: errorTmdbTitle } = await client.from('tmdb_titles').select().eq('id', id).eq('media_type', mediaType);

        if (errorTmdbTitle) {
            throw createError({ statusMessage: errorTmdbTitle.message });
        }

        if (!tmdbTitle[0]?.id) {
            const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?language=${language}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.tmdbApiKey}`
                },
                method: 'GET'
            });

            const json = await res.json();

            const { data: newTmdbTitle, error: errorNewTmdbTitle } = await client.from('tmdb_titles')
                .upsert({
                    id: json.id,
                    media_type: mediaType,
                    data: json
                })
                .select()
                .single();

            if (errorNewTmdbTitle) {
                throw createError({ statusMessage: errorNewTmdbTitle.message });
            }
        }

        const { data: newTitle, error: errorNewTitle } = await client.from('titles')
            .upsert({
                category_id: categoryId,
                tmdb_title_id: id,
                liked
            })
            .select('*, title:tmdb_titles (data, media_type, updated_at)');

        if (errorNewTitle) {
            throw createError({ statusMessage: errorNewTitle.message });
        }
        
        listTitles.push(errorNewTitle ? errorNewTitle : newTitle[0]);
    }

    return listTitles;
});