import { createError } from 'h3';
import type { Database } from '~~/types/database.types';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);
    
    const { action, ids, categoryId } = await readBody(event) as { action: 'like' | 'unlike' | 'move', ids: Array<number>, categoryId: number };

    if (action === 'move') {
        const { data, error } = await client.from('titles')
            .update({
                category_id: categoryId
            })
            .in('id', ids);

        if (error) {
            throw createError({ statusMessage: error.message });
        }
    } else if (action === 'like' || action === 'unlike') {
        const { data, error } = await client.from('titles')
            .update({
                liked: action === 'like'
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