import { createError } from 'h3';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
    const $user = await $userAuth.getUser(event);

    const userId = getRouterParam(event, 'userId');

    const isAuthUser = $user && String($user._id) === String(userId);

    const lists = await ListSchema.find({ userId }).select('-userId');

    return lists;
});
