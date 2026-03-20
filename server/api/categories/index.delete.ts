import { createError } from 'h3';
import { Category } from '~~/types/db/category';

// * Types
import { List } from '~~/types/db/list';
import { LogName } from '~~/types/db/log';

interface Body {
    ids: Array<string>;
}


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    const { ids } = await readBody<Body>(event);

    let categories = await CategorySchema
        .find({
            _id: { $in: ids.map(String) }
        })
        .populate('list')
        .lean();

    categories = categories.filter(category => String((category.list as List)?.user) === String($user._id));

    if (categories?.length < 1) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Couldn\'t find at least one category'
        });
    }

    const categoryIds = categories.map(r => String(r._id));

    const deletedCategories = await CategorySchema
        .deleteMany({
            _id: { $in: categoryIds }
        });

    createLogs(String($user._id), LogName.Category.Delete, categories, ({ list, ...category }) => {
        if (!categoryIds.includes(String(category._id))) return null;
    
        return {
            category: new LogObjectId(category._id),
            deletedData: {
                ...category,
                list: (list as List)?._id
            }
        }
    });

    const titles = await TitleSchema
        .find({
            category: { $in: categoryIds }
        })
        .lean();

    const titleIds = titles.map(title => String(title._id));

    const resultDeleteTitles = await TitleSchema
        .deleteMany({
            _id: { $in: titleIds }
        });

    createLogs(String($user._id), LogName.Title.Delete, titles, ({ category, ...title }) => {
        if (!titleIds.includes(String(title._id))) return null;
    
        return {
            title: new LogObjectId(title._id),
            deletedData: {
                ...title,
                category: new LogObjectId((category as Category)?._id)
            }
        }
    });

    return {
        success: true,
        deletedCategories: categoryIds,
        deletedTitles: titleIds
    };
});