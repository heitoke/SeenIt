import { createError } from 'h3';

// * Types
import { Category } from '~~/types/db/category';
import { List } from '~~/types/db/list';
import { LogCode } from '~~/types/db/log';

export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    const categoryId = await getRouterParam(event, 'categoryId');

    const { name, private: privateMode } = await readBody<Partial<Pick<Category, 'name' | 'private'>>>(event);

    const category = await CategorySchema
        .findOne({ _id: String(categoryId) })
        .populate('list');

    if (!category) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found category by id'
        });
    }

    if (String((category.list as List)?.user) !== String($user._id)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You don\'t have enough rights'
        });
    }

    const from = {
        name: category.name,
        private: category.private
    }

    if (name) category.name = name;
    if (privateMode !== undefined) category.private = privateMode;

    await category.save();

    createLog(String($user._id), LogCode.Category.Update, {
        category: new LogObjectId(categoryId),
        from,
        to: {
            name: category.name,
            private: category.private
        }
    });

    return category.toObject({ depopulate: true });
});