<template>
    <div class="one-tab"></div>
</template>

<script lang="ts" setup>

// * Types
import type { User } from '~~/types/db/user';


const { user, me } = useUserAuth();


async function handleMessage(event: MessageEvent<{ type: string, data: Record<string, any> }>) {
    const { type, data } = event.data;

    if (type === 'logins:get') {
        const logins = $cookies.searchByName('SI_').map(name => {
            const login = $cookies.get(name);

            if (!login) return null;

            const [host, token, user] = atob(login).split('|');

            return {
                host,
                user: JSON.parse(String(user))
            }
        });

        event.source?.postMessage({
            type,
            data: {
                logins,
                user: {
                    ...user.value
                }
            }
        }, event.origin as any);
    }

    if (type === 'auth:user') {
        const { host, user, token } = data as { host: string, user: User, token: string };

        $cookies.set(`SI_${Date.now()}`, btoa(`${host}|${token}|${JSON.stringify(user)}`), {
            secure: true,
            path: '/',
            'max-age': 604800,
            SameSite: 'None'
        });
    }
}

onMounted(() => {
    window.addEventListener('message', handleMessage);
    
    if (window.parent !== window) {
        window.parent.postMessage('ready', '*');
    }
});

onUnmounted(() => {
    window.removeEventListener('message', handleMessage);
});

</script>

<style lang="scss" scoped>

.page.one-tab {
    margin: 0;
    padding: 12px;
    box-sizing: border-box;
    overflow: hidden;
}

</style>