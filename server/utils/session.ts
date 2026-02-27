// * Types
import type { H3Event } from 'h3';
import type { AuthPayload } from '~~/types/auth';


const { mongo } = useRuntimeConfig().auth;

export async function $useSession(event: H3Event, userId?: string) {
    const session = await useSession(event, {
        password: mongo.secret,
        name: 'authorization',
    });

    if (userId) await session.update({ id: userId });

    return {
        ...session,
        data: session.data as AuthPayload
    }
}