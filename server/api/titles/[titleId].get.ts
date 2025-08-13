import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const titleId = getRouterParam(event, 'titleId');

    // const isAuthUser = $user?.id === userId;

    const { data: title, error: errorTitle } = await client
        .from('titles')
        .select(`*, title:tmdb_titles (*), category:categories (*, list:lists (*))`)
        .eq('id', titleId)
        .single();
    
    // if (!isAuthUser) {
    //     query = query
    //         .eq('private', false)
    //         .not('categories.private', 'eq', true)
    //         .not('categories.titles.private', 'eq', true)
    // }

    // const { data: lists, error: errorLists } = await query;

    if (errorTitle) {
        throw createError({ statusMessage: errorTitle.message });
    }

    return title;
});