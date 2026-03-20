import { createError } from 'h3';
import { List } from '~~/types/db/list';

// * Types
import type { DataTitle } from '~~/types/db/title';


interface Body {
    categoryId: number;
    titles: Array<{
        id: number;
        mediaType: 'movie' | 'tv';
    }>;
    language: string;
    liked: number;
    rating: number;
}

const mediaTypes: Record<'movie' | 'tv', number> = {
    movie: 0,
    tv: 1
}


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    if (!$user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not auth'
        });
    }

    const config = useRuntimeConfig(event);

    const { categoryId, titles, language = 'en-US', liked = 0, rating = 0 } = await readBody(event) as Body;

    const category = await CategorySchema.findOne({ _id: String(categoryId) }).populate('list');

    if (!category?._id) {
        throw createError({ statusCode: 404, statusMessage: 'Not found catgory by id' });
    }

    const list = category.list as List;

    if (String(list.user) !== String($user?._id)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You don\'t have enough rights'
        });
    }

    const listTMDBTitles = await TMDBTitleSchema.find({
        $or: titles.map(title => ({
            tmdbId: title.id,
            mediaType: title.mediaType === 'movie' ? 0 : 1
        }))
    }).lean();

    const listTitles: Array<DataTitle> = [];

    for (const { id, mediaType } of titles) {
        let tmdbTitle = listTMDBTitles.find(title => Number(title.tmdbId) === id && Number(title.mediaType) === (mediaType === 'movie' ? 0 : 1));

        if (!tmdbTitle?._id) {
            const res = await fetch(`${config.tmdbApiUrl}/${mediaType}/${id}?language=${language}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${config.tmdbApiKey}`
                },
                method: 'GET'
            });

            const json = await res.json();

            const newTMDBTitle = await new TMDBTitleSchema({
                tmdbId: id,
                mediaType: mediaType === 'movie' ? 0 : 1,
                data: json
            });

            await newTMDBTitle.save();

            tmdbTitle = await newTMDBTitle.toObject();
        }

        const newTitle = await new TitleSchema({
            category: String(category._id),
            tmdbTitle: String(tmdbTitle._id),
            liked,
            rating
        });

        await newTitle.save();

        const { category: _c, tmdbTitle: _t, __v, ...title } = newTitle.toObject();
        
        listTitles.push({
            ...title,
            data: {
                ...tmdbTitle.data,
                mediaType: tmdbTitle.mediaType
            }
        } as any as DataTitle);
    }

    return listTitles;
});