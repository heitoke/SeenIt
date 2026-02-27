import { SignJWT, jwtVerify } from 'jose';

// * Types
import type { AuthPayload } from '~~/types/auth';

const { mongo } = useRuntimeConfig().auth;

const JWT_SECRET = new TextEncoder().encode(mongo.secret);

export async function createJWT(userId: string) {
    return await new SignJWT({ id: userId, createdAt: Date.now() })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('seenit-auth.nuxt.space')
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
    return (await jwtVerify(token, JWT_SECRET)).payload as AuthPayload;
}