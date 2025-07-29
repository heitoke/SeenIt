import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const $user = await serverSupabaseUser(event);
    const client = await serverSupabaseClient<Database>(event);

    const { name } = await readBody(event) as { name: string };

    const { data, error } = await client.from('lists')
        .upsert({
            user_id: $user?.id,
            name,
        })
        .select('id, name, created_at')
        .single();

    if (error) {
        throw createError({ statusMessage: error.message });
    }

    return data;
});