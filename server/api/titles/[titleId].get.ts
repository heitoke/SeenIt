import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const titleId = getRouterParam(event, 'titleId');

    // const isAuthUser = $user?.id === userId;

    const { data: lists, error: errorLists } = await client
        .from('titles')
        .select(`*, categories(*, titles (*, title:tmdb_titles (data, media_type, updated_at)))`)
        .eq('id', titleId)
        .order('created_at', { ascending: true })
        .order('created_at', { ascending: true, referencedTable: 'categories' })
        .order('created_at', { ascending: true, referencedTable: 'categories.titles' })
    
    // if (!isAuthUser) {
    //     query = query
    //         .eq('private', false)
    //         .not('categories.private', 'eq', true)
    //         .not('categories.titles.private', 'eq', true)
    // }

    // const { data: lists, error: errorLists } = await query;

    if (errorLists) {
        throw createError({ statusMessage: errorLists.message });
    }

    return lists;
});