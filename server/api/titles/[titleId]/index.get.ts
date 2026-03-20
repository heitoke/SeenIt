import { createError } from 'h3';

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
        .lean<any>({ virtuals: true });
    
    if (Boolean(title?.private) && String(title?.category?.list?.user?._id) !== String($user?._id)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found title by id'
        })
    }

    title['data'] = {
        ...title?.tmdbTitle?.data,
        mediaType: title?.tmdbTitle?.mediaType
    }

    delete title['tmdbTitle'];

    return title;
});