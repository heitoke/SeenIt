import { createError } from 'h3';

// * Types
import { User } from '~~/types/db/user';
import { List } from '~~/types/db/list';
import { Category } from '~~/types/db/category';
import { Title } from '~~/types/db/title';
import { TMDBTitle } from '~~/types/db/tmdbTitle';
import { LogCode } from '~~/types/db/log';


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.getUser(event);

    const titleId = getRouterParam(event, 'titleId');

    const title = await TitleSchema
        .findOne({ _id: String(titleId) })
        .populate('tmdbTitle')
        .populate([
            {
                path: 'category',
                select: ['-__v'],
                populate: {
                    path: 'list',
                    select: ['-__v'],
                    populate: {
                        path: 'user',
                        select: ['-password']
                    }
                }
            },
            {
                path: 'tmdbTitle'
            }
        ])
        .select(['-__v'])
        .lean<Title<Category<List<User>>, TMDBTitle>>({ virtuals: true });
    
    if (Boolean(title?.private) && String(title?.category?.list?.user?._id) !== String($user?._id)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found title by id'
        })
    }

    const logs = await LogSchema
        .find({
            'props.title': title?._id,
            code: LogCode.Title.ChangeStatusEpisode
        } as any)
        .select('-user -__v')
        .lean();

    const result: Record<number, Record<number, { status: number }>> = {};

    for (const { props } of logs) {
        const { season, episode, status } = props as Record<'season' | 'episode' | 'status', number>;

        if (!result[season]) result[season] = {};
    
        result[season][episode] = { status };
    }

    return result;
});