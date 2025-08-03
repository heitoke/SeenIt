import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const listId = await getRouterParam(event, 'listId');

    const { data: list, error } = await client
        .from('lists')
        .select(`*, categories(*, titles (*))`)
        .eq('id', listId)
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    if (!list?.id) {
        throw createError({ statusCode: 404, statusMessage: 'Not found list' });
    }


    const allTitles = list.categories.flatMap((c: any) => c.titles || []);

    const { data: deleteTitles, error: errorDeleteTitles } = await client.from('titles')
        .delete()
        .in('id', allTitles.map((t: any) => t.id));

    if (errorDeleteTitles) {
        throw createError({ statusMessage: errorDeleteTitles.message });
    }


    const { data: deleteCategories, error: errorDeleteCategories } = await client.from('categories')
        .delete()
        .in('id', list.categories.map((c: any) => c.id));

    if (errorDeleteCategories) {
        throw createError({ statusMessage: errorDeleteCategories.message });
    }
    

    const { data: deleteList, error: errorDeleteList } = await client.from('lists')
        .delete()
        .eq('id', listId);

    if (errorDeleteList) {
        throw createError({ statusMessage: errorDeleteList.message });
    }

    return true;
});