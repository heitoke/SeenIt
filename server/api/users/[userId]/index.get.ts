import { Types } from 'mongoose';

// * Schema
import { UserSchema } from '~~/server/models/user.schema';

// * Types
import type { User } from '~~/types/db/user';


export default defineEventHandler(async (event) => {
    const userId = event.context.params?.userId;

    try {
        const user = await UserSchema.findOne(Types.ObjectId.isValid(String(userId)) ? {
            _id: userId
        } : {
            username: userId
        }).select('-password');

        if (!user) throw createError({
            statusCode: 404,
            statusMessage: `This user does not exist in this system`,
        });

        return user.toJSON() as any as User;
    } catch (error) {
        throw createError({
            statusCode: 404,
            statusMessage: `This user does not exist in this system`,
        });
    }
});