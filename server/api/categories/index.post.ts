import { createError } from 'h3';

// * Types
import { CategoryType } from '~~/types/db/category';

interface Body {
    listId: string;
    name: string;
    private?: boolean;
}


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    const { listId, name, private: privateMode = false } = await readBody<Body>(event);

    const list = await ListSchema.findOne({ user: $user._id, _id: listId });

    if (!list?._id) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found list!',
        });
    }
    
    const newCategory = await new CategorySchema({
        list: listId,
        name,
        private: privateMode,
        type: CategoryType.None
    });
    
    await newCategory.save();
    
    return newCategory;
});