import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.from('lists').select('id, name, created_at').eq('user_id', $user!.id).order('created_at');

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});