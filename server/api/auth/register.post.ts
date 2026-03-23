import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const regexUsername = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{1,18}[a-zA-Z0-9]$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default defineEventHandler(async (event) => {
    const $config = useRuntimeConfig();

    const { username, email, password } = await readBody(event);

    if (!regexUsername.test(username)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid username'
        });
    }
    if (!regexEmail.test(email)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid email'
        });
    }
    if (!regexPassword.test(password)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Password must be at least 8 characters, contain uppercase, lowercase, digit, and special character'
        });
    }

    let newUser;

    const hashed = await bcrypt.hash(password + $config.secret, 10);

    try {
        newUser = await mongoose.connection.db?.collection('users').insertOne({ username, email, password: hashed });
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