<template>
    <div class="one-tab">
        <iframe ref="iframe" :src="authIFrameUrl"
            @load="onIFrameLoad"
        />

        <h3>Имеются автозиации в других сетях</h3>

        <div class="users">
            <UserCard v-for="{ host, user } of logins" :key="user._id"
                variant="compact"
                :user="user"
                :text="`Host: ${host}`"
            >
                <template #after>
                    <Button variant="outline" style="margin-left: auto;">
                        <LogIn :size="12"/>
                    </Button>
                </template>
            </UserCard>
        </div>
    </div>
</template>

<script lang="ts" setup>

import Image from '../ui/Image.vue';
import UserCard from '../modules/card/User.vue';

// * Icons
import { LogIn } from 'lucide-vue-next';

// * Types
import type { User } from '~~/types/db/user';


const $onaTab = useOneTabStore();

const authDomain = 'http://127.0.0.1:7433'; // 'https://seen-it.vercel.app';
const authIFrameUrl = authDomain + '/one-tab';

const iframe = ref<HTMLIFrameElement | null>(null);

const logins = ref<Array<{ host: string, user: User }>>([]);


const sendMessage = (type: string, data: Record<string, any> = {}) => {
    if (!iframe.value?.contentWindow) return false;

    iframe.value.contentWindow?.postMessage({
        type,
        data
    }, authDomain);
}

async function handleIFrameMessage(event: MessageEvent<{ type: string, data: Record<string, any> }>) {
    if (event.origin !== authDomain) return;

    const { type, data } = event.data;

    if (type === 'logins:get') {
        logins.value = data.logins as any;
    }
}

function onIFrameLoad() {
    sendMessage('logins:get');
}


onMounted(() => {
    $onaTab.emitter.on('auth:user', ({ user, token }) => {
        if (!user?._id) return;

        if (authDomain === location.origin) {
            $cookies.set(`SI_${Date.now()}`, btoa(`${location.host}|${token}|${JSON.stringify(user)}`), {
                secure: true,
                path: '/',
                'max-age': 604800,
                SameSite: 'None'
            });
        } else {
            sendMessage('auth:user', {
                host: location.host,
                user,
                token
            });
        }
    });

    window.addEventListener('message', handleIFrameMessage);
});

onUnmounted(() => {
    window.removeEventListener('message', handleIFrameMessage);
});

</script>

<style lang="scss" scoped>

.one-tab {
    padding: 8px;
    position: fixed;
    top: 64px;
    right: 12px;
    border-radius: var(--hx-border-radius);
    border: 1px solid var(--hx-background-transparent);
    background-color: var(--hx-background-primary);
    overflow: hidden;
    z-index: 99999999999;

    iframe {
        display: none;
        border: none;
    }

    h3 {
        margin-bottom: 8px;
        font-size: 14px;
    }

    .users {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .user {
            display: flex;
            padding: 4px;
            border-radius: var(--hx-border-radius);
            border: 1px dashed var(--hx-background-transparent);
            align-items: center;

            :deep(.ui-image) {
                margin-right: 8px;
                border-radius: var(--hx-border-radius);
            }

            & > div {
                div:nth-child(1) {
                    font-size: 14px;
                }

                div:nth-child(2) {
                    font-size: 10px;
                    opacity: .5;
                }
            }

            .ui-button {
                margin-left: auto;
            }
        }
    }
}

</style>