import { createError } from 'h3';

// * Types
import type { User } from '~~/types/db/user';
import type { List } from '~~/types/db/list';
import type { Category } from '~~/types/db/category';
import type { Title } from '~~/types/db/title';
import type { Season, TMDBTitle } from '~~/types/db/tmdbTitle';


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.getUser(event);

    const titleId = getRouterParam(event, 'titleId');
    const seasonNumber = getRouterParam(event, 'season');

    const title = await TitleSchema
        .findOne({ _id: String(titleId) })
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
                path: 'tmdbTitle',
                match: { mediaType: 1 }
            }
        ])
        .select(['-__v'])
        .lean<Title<Category<List<User>>, TMDBTitle>>({ virtuals: true });
    
    if (!title?.tmdbTitle || (Boolean(title?.private) && String(title?.category?.list?.user?._id) !== String($user?._id))) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found title by id'
        })
    }

    const config = useRuntimeConfig(event);

    const { tmdbId } = title?.tmdbTitle!;

    const res = await fetch(`${config.tmdbApiUrl}/tv/${tmdbId}/season/${seasonNumber}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.tmdbApiKey}`
        },
        method: 'GET'
    });

    if (!res.ok) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error server'
        });
    }

    const json = await res.json();

    return json as Season;
});