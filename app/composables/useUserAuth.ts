// * Types
import type { AuthPayload } from '~~/types/auth';


const useUserSessionState = () => useState<AuthPayload>('nuxt-mongoose-auth', () => ({}));


async function me() {
    useUserSessionState().value = await useRequestFetch()('/api/auth/me', {
        headers: {
            Accept: 'text/json'
        }
    }).catch(() => ({}));
}

async function logOut() {
    await $fetch('/api/auth/logout', { method: 'DELETE' });

    useUserSessionState().value = {};
}


export function useUserAuth() {
    const sessionState = useUserSessionState();

    return {
        loggedIn: computed(() => Boolean(sessionState.value?.email)),
        user: computed(() => sessionState.value || null),
        logOut,
        me
    }
}