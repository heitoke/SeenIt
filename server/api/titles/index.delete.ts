import { createError } from 'h3';

// * Types
import { List } from '~~/types/db/list';
import { Category } from '~~/types/db/category';
import { LogCode } from '~~/types/db/log';
import { Title } from '~~/types/db/title';

interface Body {
    ids: Array<string>;
}


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    const { ids } = await readBody<Body>(event);

    let titles = await TitleSchema
        .find({
            _id: { $in: ids.map(String) }
        })
        .populate({
            path: 'category',
            populate: {
                path: 'list'
            }
        })
        .lean();

    titles = titles.filter(title => {
        return String(((title.category as Category).list as List).user) === String($user._id);
    });

    if (titles?.length < 1) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Couldn\'t find at least one title'
        });
    }

    const titleIds = titles.map(title => String(title._id));

    const resultDeleteTitles = await TitleSchema
        .deleteMany({
            _id: { $in: titleIds }
        });

    createLogs(String($user._id), LogCode.Title.Delete, titles, ({ category, ...title }) => {
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
        deletedTitles: titleIds
    };
});