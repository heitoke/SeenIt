import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    // const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const userId = getRouterParam(event, 'id');

    const { data: lists, error: errorLists } = await client.from('lists').select().eq('user_id', userId);

    if (errorLists) {
        throw createError({ statusMessage: errorLists.message });
    }

    const { data: categories, error: errorCategories } = await client.from('categories').select().in('list_id', lists.map(l => l.id));

    if (errorCategories) {
        throw createError({ statusMessage: errorCategories.message });
    }

    const { data: titles, error: errorTitles } = await client.from('titles').select('*, title:tmdb_titles (data, media_type, updated_at)').in('category_id', categories.map(l => l.id));

    if (errorTitles) {
        throw createError({ statusMessage: errorTitles.message });
    }

    return {
        lists,
        categories,
        titles
    };
});