import { createError } from 'h3';

// * Types
import type { List } from '~~/types/db/list';

export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    const listId = await getRouterParam(event, 'listId');

    const { name, private: privateMode } = await readBody(event) as Pick<List, 'name' | 'private'>;

    const result = await ListSchema
        .findByIdAndUpdate(String(listId), {
            $set: {
                name,
                private: privateMode
            }
        }, {
            new: true
        });

    return result;
});