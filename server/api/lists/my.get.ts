import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const { data: lists, error: errorLists } = await client.from('lists').select().eq('user_id', $user!.id);

    if (errorLists) {
        throw createError({ statusMessage: errorLists.message });
    }

    const { data: categories, error: errorCategories } = await client.from('categories').select().in('list_id', lists.map(l => l.id));

    if (errorCategories) {
        throw createError({ statusMessage: errorCategories.message });
    }

    return {
        lists,
        categories
    };
});