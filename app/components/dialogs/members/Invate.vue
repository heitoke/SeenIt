<template>
    <Dialog
        title="Поиск участников"
        description="Используйте поиск для того чтобы найти пользователей которых хотите пригласить."

        style="max-width: 376px;"
    >
        <template v-slot="{ show, hide }">
            <slot :show="show" :hide="hide"/>
        </template>
        
        <template v-slot:content="{ hide }">
            <div>
                <div class="header">
                    <Tooltip>
                        <template #trigger>
                            <CircleQuestionMark :size="16" style=""/>
                        </template>

                        <template #default>
                            <div style="max-width: 256px; text-align: center;">
                                Specify the <b>ID, username</b> to search for the user on this network, or use <b>domain@(ID, username)</b> to search on other networks.
                            </div>
                        </template>
                    </Tooltip>

                    <Group style="width: 100%;">
                        <Input style="width: 100%;"
                            placeholder="Username or email"
                            name="username, email"
    
                            v-model:value="username"
                        />
    
                        <Button
                            :disabled="isLoading"
                            @click="onSearchUser"
                        >
                            <template v-if="isLoading">
                                <Loader2 class="animation-spin"/>
                            </template>
                            <template v-else>
                                <Search/>
                                <span style="margin-left: 4px;">Поиск</span>
                            </template>
                        </Button>
                    </Group>
                </div>

                <div class="user" v-if="result">
                    <Image :src="getUrlAvatar(result?._id)"/>
                    
                    <div>
                        <div>@{{ result?.username || result?._id }}</div>
                        <div>{{ result.host }}</div>
                    </div>

                    <Button style="margin-left: auto;"
                        variant="outline"

                        @click="onAdd"
                    >
                        {{ selected.findIndex(s => s.host == result?.host && s.user._id === result?._id) >= 0 ? 'Удалить' : 'Добавить' }}
                    </Button>
                </div>

                <template v-if="selected.length > 0">
                    <div class="users">
                        <div class="user" v-for="({ host, user }) of selected" :key="user._id">
                            <Image :src="getUrlAvatar(user?._id)"/>
                            
                            <div>
                                <div>@{{ user?.username || user?._id }}</div>
                                <div>{{ host }}</div>
                            </div>

                            <Button style="margin-left: auto;"
                                variant="outline"

                                @click="onAdd"
                            >
                                {{ selected.findIndex(s => s.host == host && s.user._id === user?._id) >= 0 ? 'Удалить' : 'Добавить' }}
                            </Button>
                        </div>
                    </div>
                </template>
            </div>
        </template>

        <template v-slot:footer="{ hide }">
            <Button variant="secondary" @click="hide">
                <X/>
                <span>{{ $t('cancel') }}</span>
            </Button>

            <Button :disabled="selected?.length < 1"
                @click="onInvateMembers"
            >
                <UserPlus/>
                <span>Пригласить ({{ selected.length }})</span>
            </Button>
        </template>
    </Dialog>
</template>

<script lang="ts" setup>

import { CircleQuestionMark, Search, UserPlus, Loader2, X } from 'lucide-vue-next';

// * Types
import type { User } from '~~/types/db/user';


// * Types
export interface InvateMember {
    user: User;
    permissions: number;
    host: string;
}


const regexUsername = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{1,22}[a-zA-Z0-9]$/;
const regexHostUsername = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?|localhost(?::\d+)?|(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})(?::\d+)?)@(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{1,22}[a-zA-Z0-9]$/;

const $request = useRequestURL();


const { $notifications } = useNotificationsStore();


const $emit = defineEmits({
    invite(data: Array<InvateMember>) {
        return data;
    }
});

const props = defineProps();


const isLoading = ref<boolean>(false);
const username = ref<string>('seen-it.vercel.app@69c1032844bb8b64da981643');
const selected = ref<Array<InvateMember>>([]);
const result = ref<User & { host: string } | null>(null);

const history: Record<string, User & { host: string } | null> = {};


async function onSearchUser() {
    if (!username.value || username.value.trim() === '') return;

    if (!regexUsername.test(username.value) && !regexHostUsername.test(username.value)) return;

    const [host, _username] = username.value.match(/^([^@]+)@(.*)$/)?.slice(1) || [$request.host, username.value];

    if (history[username.value] === null) return;
    else if (history[username.value]?._id) {
        result.value = history[username.value]!;
        return;
    }
    
    isLoading.value = true;

    const res = await fetch(`http://${host}/api/users/${_username}`);
    
    isLoading.value = false;

    if (!res.ok) {
        console.log(res)
        return $notifications.add([{
            mode: 'default',
            title: `Request error (${res.status})`,
            text: String(res.statusText),
            color: 'tomato'
        }], false);
    }

    const data = (await res.json()) as User;

    if (!data?._id || !data?.username) return history[username.value] = null;

    history[username.value] = result.value = {
        ...data,
        host: $request.host === host ? 'host' : host!
    };
}

function onAdd() {
    if (!result.value) return;

    const { host, ...user } = result.value;

    const userIndex = selected.value.findIndex(s => s.host == host && s.user._id === user?._id);

    if (userIndex >= 0) {
        selected.value.splice(userIndex, 1);
        return;
    }

    selected.value.push({
        user,
        permissions: 0,
        host
    });
}

async function onInvateMembers() {
    $emit('invite', selected.value);
}


/*

1. Если добавил выше по иерархии в список или категорию, при доавлении в татйл совместного просмотра не требуется подтверждение(возможно только уведомление)
2. Можно выбрать будут ли приглашенные пользователя автоматически добавляться в тайтлы
3. Права на редактирование или только чтение(при приглашении - только чтение). Редактирование - это права на редактирование списка или категории и перемещение элементов между ними.
4. Права на оставление комментариев(сразу есть) в зависимости от иерархии(если список или категория то распространяется на все что внутри данного приглашения)
5. 
*/

</script>

<style lang="scss" scoped>

.header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.users {
    margin-top: 12px;
    max-height: 256px;
    border-top: 1px solid var(--hx-background-transparent);
    overflow-x: hidden;
}

.user {
    display: flex;
    margin-top: 12px;
    padding: 12px;
    width: 100%;
    border-radius: var(--hx-border-radius);
    align-items: center;
    background-color: var(--hx-background-primary);
    box-sizing: border-box;
    gap: 12px;

    :deep(.ui-image) {
        border-radius: var(--hx-border-radius);
    }

    :deep(.ui-image) + div {
        & > div:first-child {
            font-size: 14px;
            font-weight: 600;
        }

        & > div:last-child {
            font-size: 12px;
            opacity: .5;
        }
    }
}

</style>