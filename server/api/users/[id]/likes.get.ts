import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const userId = getRouterParam(event, 'id');

    const isAuthUser = String($user?.app_metadata?.public_id) === String(userId);

    let query = client
        .from('titles')
        .select(`*, title:tmdb_titles (data, media_type, updated_at), category:categories (*, list:lists (*))`)
        .eq('category.list.user_id', userId)
        .gt('liked', 0)
        .order('created_at', { ascending: true })
    
    if (!isAuthUser) {
        query = query
            .eq('private', false)
    }

    const { data: lists, error: errorLists } = await query;

    if (errorLists) {
        throw createError({ statusMessage: errorLists.message });
    }

    return lists;
});