import { createError } from 'h3';

// * Types
import { User } from '~~/types/db/user';
import { List } from '~~/types/db/list';
import { Category } from '~~/types/db/category';
import { Title } from '~~/types/db/title';
import { TMDBTitle, TMDBTitleInSearch } from '~~/types/db/tmdbTitle';


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
        });
    }

    const config = useRuntimeConfig(event);

    const { tmdbId, mediaType } = title?.tmdbTitle!;

    const res = await fetch(`${config.tmdbApiUrl}/${mediaType === 0 ? 'movie' : 'tv'}/${tmdbId}/recommendations`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.tmdbApiKey}`
        },
        method: 'GET'
    });

    if (!res.ok) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error'
        })
    }

    const json = await res.json();

    return json?.results as Array<TMDBTitleInSearch>;
});