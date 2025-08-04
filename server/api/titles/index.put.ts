import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);
    
    const { action, ids, value } = await readBody(event) as { action: 'like' | 'private' | 'move', ids: Array<number>, value: number | string | boolean };

    if (action === 'move') {
        const { data, error } = await client.from('titles')
            .update({
                category_id: Number(value)
            })
            .in('id', ids);

        if (error) {
            throw createError({ statusMessage: error.message });
        }
    } else if (action === 'like') {
        const { data, error } = await client.from('titles')
            .update({
                liked: Number(value)
            })
            .in('id', ids);

        if (error) {
            throw createError({ statusMessage: error.message });
        }

        return {
            success: true,
            result: false
        }
    } else if (action === 'private') {
        const { data, error } = await client.from('titles')
            .update({
                private: Boolean(value)
            })
            .in('id', ids);

        if (error) {
            throw createError({ statusMessage: error.message });
        }

        return {
            success: true,
            result: false
        }
    }

    return {
        success: true
    };
});