// * Types
import type { User } from '~~/types/db/user';


const useUserSessionState = () => useState<Partial<User>>('nuxt-mongoose-auth', () => ({}));


async function me() {
    return useUserSessionState().value = await useRequestFetch()('/api/auth/me', {
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
    const dashboards = useDashboardsStore();

    return {
        loggedIn: computed(() => Boolean(sessionState.value?._id)),
        user: computed(() => sessionState.value || null),
        d: dashboards.get(String(sessionState.value?._id)),
        logOut,
        me
    }
}