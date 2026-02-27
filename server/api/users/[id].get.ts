import { UserSchema } from '~~/server/models/user.schema';

// * Types
import type { User } from '~~/types/user';


export default defineEventHandler(async (event) => {
    const userId = event.context.params?.id;

    try {
        const user = await UserSchema.findOne({ _id: userId }).select('-password');

        if (!user) throw createError({
            statusCode: 404,
            statusMessage: 'Not found!',
        });

        return user.toJSON() as any as User;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found!',
        });
    }
});