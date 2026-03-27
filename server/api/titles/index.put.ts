import { createError } from 'h3';
import { LogCode } from '~~/types/db/log';

// * Types
interface Body {
    action: 'like' | 'private' | 'move';
    ids: Array<number>;
    value: number | string | boolean
}


export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);
    
    const { action, ids, value } = await readBody(event) as Body;

    const titles = await TitleSchema
        .find({
            _id: { $in: ids.map(String) }
        });

    if (titles?.length < 1) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Couldn\'t find at least one title'
        });
    }

    const titleIds = titles.map(title => String(title._id));

    if (action === 'move') {
        const result = await TitleSchema.updateMany({
            _id: { $in: titleIds }
        }, {
            $set: {
                category: String(value)
            }
        }, {
            timestamps: true
        });

        createLogs(String($user._id), LogCode.Title.MoveToCategory, titles, title => {
            if (!titleIds.includes(String(title._id))) return null;

            return {
                title: new LogObjectId(title._id),
                from:new LogObjectId(String(title.category)),
                to: new LogObjectId(String(value)),
            }
        });

        return { success: true, movedTitles: titleIds };
    } else if (action === 'like') {
        const result = await TitleSchema.updateMany({
            _id: { $in: titleIds }
        }, {
            $set: {
                liked: Number(value)
            }
        }, {
            timestamps: true
        });

        createLogs(String($user._id), LogCode.Title.Like, titles, title => {
            if (!titleIds.includes(String(title._id))) return null;

            return {
                title: new LogObjectId(title._id),
                from: title.liked,
                to: Number(value)
            }
        });

        return { success: true, likedTitles: titleIds };
    } else if (action === 'private') {
        const result = await TitleSchema.updateMany({
            _id: { $in: titleIds }
        }, {
            $set: {
                private: Boolean(value)
            }
        }, {
            timestamps: true
        });

        createLogs(String($user._id), LogCode.Title.Private, titles, title => {
            if (!titleIds.includes(String(title._id))) return null;

            return {
                title: new LogObjectId(title._id),
                from: title.private,
                to: Boolean(value)
            }
        });

        return { success: true, privatedTitles: titleIds };
    }

    return { success: false, result: null };
});