import mongoose from 'mongoose';

const errorMessage = 'login or password is wrong! please try again later';

export default defineEventHandler(async (event) => {
    // TODO: use validation
    const { login, password } = await readBody(event)

    if (!login || !password) {
        throw createError({
            statusMessage: 'required field',
        });
    }

    const user = await mongoose.connection.db?.collection('users').findOne({ $or: [{ login }, { username: login }] });

    if (!user) throw createError({
        statusMessage: errorMessage
    });

    if (password !== user.password) throw createError({
        statusMessage: errorMessage
    });

    await $userAuth.set(event, String(user._id));

    return {
        loggedIn: true
    }
})