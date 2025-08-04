import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const categoryId = await getRouterParam(event, 'categoryId');

    const { data: category, error } = await client
        .from('categories')
        .select(`*, titles (*), list:lists (*)`)
        .eq('id', categoryId)
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    if (!category?.id) {
        throw createError({ statusCode: 404, statusMessage: 'Not found category' });
    }

    if (category?.list?.user_id !== $user?.id) {
        throw createError({ statusCode: 403, statusMessage: 'NOT' });
    }


    const allTitles = category.titles.map((t: any) => t.id);

    const { data: deleteTitles, error: errorDeleteTitles } = await client.from('titles')
        .delete()
        .in('id', allTitles.map((t: any) => t.id));

    if (errorDeleteTitles) {
        throw createError({ statusMessage: errorDeleteTitles.message });
    }


    const { data: deleteCategories, error: errorDeleteCategories } = await client.from('categories')
        .delete()
        .eq('id', category.id);

    if (errorDeleteCategories) {
        throw createError({ statusMessage: errorDeleteCategories.message });
    }

    return true;
});