import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
    // TODO: use validation
    const { username, email, password } = await readBody(event);

    let newUser;

    try {
        newUser = await mongoose.connection.db?.collection('users').insertOne({ username, email, password });
    } catch (error) {
        throw createError({
            statusMessage: 'User already registered.',
        });
    }

    await $userAuth.set(event, String(newUser?.insertedId));

    return {
        registered: true
    }
});