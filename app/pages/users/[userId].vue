<template>
    <div class="user">
        <div class="header" v-if="mode === 'full' && user?.id">
            <div class="avatar">
                <img :src="user.user.avatar_url" alt="User Avatar">
            </div>

            <div>
                <div class="name">{{ user.user.name }}</div>

                <ul class="providers">
                    <li v-for="(key) of user.user.providers" :key="key">
                        <img :src="providers[key].logoUrl" alt="Logo Provider">

                        <span>{{ providers[key].name }}</span>
                    </li>
                </ul>

                <NuxtLink :to="`/u/${user.id}/lists`">
                    <Button variant="link">Открыть списки</Button>
                </NuxtLink>

                <NuxtLink :to="`/u/${user.id}/likes`">
                    <Button variant="link">{{ $t('liked') }}</Button>
                </NuxtLink>
            </div>
        </div>

        <NuxtPage :user="user" :canEdit="user?.uid === $user?.id" v-if="mode !== 'no_user'"/>

        <Alert v-if="mode === 'no_user'">
            <UserRoundMinus class="h-4 w-4" />
            <AlertTitle>{{ $t('notFoundUser.title') }}</AlertTitle>
            <AlertDescription>{{ $t('notFoundUser.description') }}</AlertDescription>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

import { UserRoundMinus } from 'lucide-vue-next';

// * Types
import { type User, providers } from '~~/types/user';


const $route = useRoute();

const $user = useSupabaseUser();


const user = ref<User>();
const mode = ref<'full' | 'lists' | 'no_user'>('no_user');


async function getUser(userId: number) {
    const data = await $fetch(`/api/users/${userId}`);

    if (!data?.id) return mode.value = 'no_user';

    user.value = data;

    mode.value = 'full';
}


onMounted(() => {
    const { userId: paramUserId, listId, categoryId } = $route.params;
    const userId = Number(paramUserId);

    if (listId && categoryId) navigateTo(`/u/${userId}/lists/${listId}/${categoryId}`);

    if ($user.value && $user.value?.app_metadata?.public_id === userId) {
        const { id, app_metadata, user_metadata, created_at } = $user.value;

        user.value = {
            id: app_metadata?.public_id,
            uid: id,
            user: {
                ...user_metadata,
                providers: app_metadata?.providers
            } as User['user'],
            created_at
        }

        mode.value = 'full';
    } else getUser(userId);
});


definePageMeta({
    name: 'user',
    alias: [
        '/u/:userId'
    ]
});

</script>

<style lang="scss" scoped>

.page.user {
    .header {
        display: flex;
        margin-bottom: 24px;
        align-items: center;

        .avatar {
            margin-right: 12px;
            width: 128px;
            height: 128px;
            position: relative;
            border-radius: 15px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .name {
            font-size: 20px;
            font-weight: 600;
        }

        .providers {
            display: flex;
            align-items: center;
            gap: 8px;

            li {
                display: flex;
                padding: 4px 8px;
                border-radius: 7px;
                border: 1px solid var(--secondary);
                align-items: center;
                user-select: none;

                img {
                    margin-right: 8px;
                    width: 16px;
                    height: 16px;
                }

                span {
                    font-size: 14px;
                    opacity: .7;
                }
            }
        }
    }
}

</style>