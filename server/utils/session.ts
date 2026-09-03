// * Types
import type { H3Event } from 'h3';
import type { AuthPayload } from '~~/types/auth';


const { mongo } = useRuntimeConfig().auth;

export async function $useSession(event: H3Event, userId?: string) {
    const session = await useSession(event, {
        password: mongo.secret,
        name: 'authorization',
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: 'none'
        },
        maxAge: 60 * 60 * 24 * 7
    });

    if (userId) await session.update({ id: userId });

    if (session?.data?.id) {
        return {
            ...session,
            data: session.data as AuthPayload
        }
    }

    const sessionToken = event.headers.get('authorization')

    if (sessionToken && sessionToken.startsWith('Bearer ')) {
        const token = sessionToken.slice(7);

        try {
            return {
                ...session,
                data: {
                    id: token,
                    data: {
                        id: token
                    }
                }
            }
        } catch (error) {
            console.error('JWT verification failed:', error)
        }
    }

    return {
        ...session,
        data: {} as AuthPayload
    }
}