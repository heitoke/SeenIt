import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const errorMessage = 'login or password is wrong! please try again later';

export default defineEventHandler(async (event) => {
    const $config = useRuntimeConfig();
    const { login, password } = await readBody(event)

    if (!login || !password) {
        throw createError({
            statusMessage: 'required field',
        });
    }

    const user = await mongoose.connection.db?.collection('users').findOne({ $or: [{ email: login }, { username: login }] }); // await UserSchema.findOne({ $or: [{ email: login }, { username: login }] });

    if (!user) throw createError({
        statusMessage: errorMessage
    });

    const matches = await bcrypt.compare(password + $config.secret, user.password);

    if (!matches) throw createError({
        statusMessage: errorMessage
    });

    await $userAuth.set(event, String(user._id));

    return {
        loggedIn: true,
        user
    }
})