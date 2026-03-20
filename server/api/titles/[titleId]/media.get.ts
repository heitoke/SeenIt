import { createError } from 'h3';

// * Types
import { User } from '~~/types/db/user';
import { List } from '~~/types/db/list';
import { Category } from '~~/types/db/category';
import { Title } from '~~/types/db/title';
import { TMDBTitle } from '~~/types/db/tmdbTitle';


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

    const config = useRuntimeConfig(event);

    const { tmdbId, mediaType } = title?.tmdbTitle!;

    const tmdbTitleUrlMediaTemplate = `${config.tmdbApiUrl}/${mediaType === 0 ? 'movie' : 'tv'}/${tmdbId}`;

    const [dataImages, dataVideos] = await Promise.all([
        tmdbTitleUrlMediaTemplate + '/images',
        tmdbTitleUrlMediaTemplate + '/videos'
    ].map(url => fetch(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.tmdbApiKey}`
        },
        method: 'GET'
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    })))

    return {
        logos: dataImages?.logos || [],
        posters: dataImages?.posters || [],
        backdrops: dataImages?.backdrops || [],
        videos: dataVideos?.results || []
    };
});