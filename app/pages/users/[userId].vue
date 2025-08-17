<template>
    <div class="user">
        <div class="header" v-if="$cu.user && showUserHeader">
            <div class="avatar">
                <Image :src="$cu.user.user.avatar_url" alt="User Avatar"/>
            </div>

            <div>
                <div class="name">{{ $cu.user.user.name }}</div>

                <ul class="providers">
                    <li v-for="(key) of $cu.user.user.providers" :key="key">
                        <img :src="providers[key].logoUrl" alt="Logo Provider">

                        <span>{{ providers[key].name }}</span>
                    </li>
                </ul>

                <NuxtLink :to="`/u/${$cu.user.id}/lists`">
                    <Button variant="link">Открыть списки</Button>
                </NuxtLink>

                <NuxtLink :to="`/u/${$cu.user.id}/likes`">
                    <Button variant="link">{{ $t('liked') }}</Button>
                </NuxtLink>
            </div>
        </div>

        <NuxtPage v-if="mode === 'ready'"/>

        <Alert v-else-if="mode === 'loading'">
            <UserRoundMinus class="h-4 w-4" />
            <AlertTitle>Loading</AlertTitle>
            <AlertDescription>a</AlertDescription>
        </Alert>

        <Alert v-else-if="mode === 'no_user'">
            <UserRoundMinus class="h-4 w-4" />
            <AlertTitle>{{ $t('notFoundUser.title') }}</AlertTitle>
            <AlertDescription>{{ $t('notFoundUser.description') }}</AlertDescription>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

import Image from '~/components/ui/Image.vue';

import { UserRoundMinus } from 'lucide-vue-next';

// * Stores
import { useCacheUsersStore } from '~/stores/cacheUsers';

// * Types
import { type User, providers } from '~~/types/user';


const $route = useRoute();

const $user = useSupabaseUser();

const $cacheUsers = useCacheUsersStore();


const { userId, listId, categoryId } = $route.params;


const $cu = $cacheUsers.get(Number(userId));


const mode = ref<'ready' | 'no_user' | 'loading'>('loading');


const showUserHeader = computed(() => {
    return mode.value === 'ready' && $cu.user?.id && ($cu.canEdit ? !$route.params.listId : true);
});


onMounted(async () => {
    if (listId && categoryId) navigateTo(`/u/${userId}/lists/${listId}/${categoryId}`);

    mode.value = 'loading';

    if (!$cu?.alreadyLoadUser) await $cu.loadUser();

    mode.value = $cu?.user?.id ? 'ready' : 'no_user';
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
            max-width: 128px;
            min-width: 128px;
            max-height: 128px;
            min-height: 128px;
            position: relative;
            border-radius: 15px;
            overflow: hidden;

            ::v-deep(.ui-image) {
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
            flex-wrap: wrap;
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

    @media (max-width: 360px) {
        .header {
            margin-bottom: 0;
            align-items: start;
            flex-direction: column;

            .avatar {
                margin: 0 auto 12px auto;
                padding-bottom: 100%;
                max-width: 100%;
                min-width: 100%;
                max-height: auto;
                min-height: auto;
            }
        }
    }
}

</style>