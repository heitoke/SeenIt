import { createError } from 'h3';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

// * Types
import type { Database } from '~~/types/database.types';
import type { List } from '~~/types/list';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const categoryId = await getRouterParam(event, 'categoryId');

    const { name, private: privateMode } = await readBody(event) as Pick<List, 'name' | 'private'>;

    const { data, error } = await client.from('categories')
        .update({
            name,
            private: privateMode
        })
        .eq('id', categoryId)
        .eq('list.user_id', $user?.id)
        .select('*, list:lists (*)')
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});