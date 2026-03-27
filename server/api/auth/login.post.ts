import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const $config = useRuntimeConfig();
    const { login, password } = await readBody(event)

    if (!login || !password) {
        throw createError({
            statusMessage: 'required field',
        });
    }

    const user = await mongoose.connection.db?.collection('users')
        .findOne({ $or: [{ email: login }, { username: login }] });

    if (!user) throw createError({
        statusCode: 404,
        statusMessage: 'The user by this login does not exist...'
    });

    const matches = await bcrypt.compare(password + $config.secret, user.password);

    if (!matches) throw createError({
        statusCode: 401,
        statusMessage: 'login or password is wrong! please try again later'
    });

    const data = await $userAuth.set(event, String(user._id));

    const { password: _, ...loginUser } = user;

    return {
        loggedIn: true,
        user: loginUser,
        token: data.data.id
    }
})