<template>
    <div class="user" v-if="$d?._id">
        <div class="header">
            <div class="banner">
                <div class="avatar">
                    <Image :src="getUrlAvatar($d?._id)" alt="User Avatar"/>
                </div>
            </div>

            <div>
                <div class="name">{{ $d?.username }}</div>
            </div>
        </div>

        <ButtonGroup style="margin: 12px 0; justify-content: start;">
            <NuxtLink v-for="link of navUserLinks" :key="link.path"
                :to="link.path.replace(':userId', String($d?._id))"
            >
                <Button
                    :variant="$route.matched.findIndex(m => m.name === link.name) > -1 ? 'default' : 'secondary'"
                >
                    <component :is="link.icon"/>

                    <span>{{ $t(link.label) }}</span>
                </Button>
            </NuxtLink>
        </ButtonGroup>

        <NuxtPage v-if="mode === 'ready'"/>

        <Alert v-else-if="mode === 'loading'">
            <template #picture>
                <UserRoundMinus class="h-4 w-4"/>
            </template>
            <template #title>Loading</template>
            <template #default>...</template>
        </Alert>

        <Alert v-else-if="mode === 'no_user'">
            <template #picture>
                <UserRoundMinus class="h-4 w-4"/>
            </template>
            <template #title>{{ $t('notFoundUser.title') }}</template>
            <template #default>{{ $t('notFoundUser.description') }}</template>
        </Alert>
    </div>
</template>

<script lang="ts" setup>

import Alert from '~/components/ui/Alert.vue';

import { Heart, ScrollText, UserRoundMinus } from 'lucide-vue-next';

// * Types
import type { User } from '~~/types/db/user';


const $route = useRoute();

const { userId, listId, categoryId } = $route.params;


const $dashboards = useDashboardsStore();

const $d = $dashboards.get(String(userId));


// const user = ref<User | null>(null);

const mode = ref<'ready' | 'no_user' | 'loading'>('loading');


const navUserLinks = [
    {
        name: 'user-lists',
        icon: ScrollText,
        label: 'dashboard',
        path: `/u/:userId/lists`
    },
    {
        name: 'user-likes',
        icon: Heart,
        label: 'liked',
        path: `/u/:userId/likes`
    }
];


// async function getUserById(userId: string) {
//     mode.value = 'loading';

//     const data = await $fetch(`/api/users/${userId}`);

//     if (!data) return mode.value = 'no_user';

//     user.value = data;

//     mode.value = 'ready';
// }


onMounted(async () => {
    // await getUserById(String(userId));
    mode.value = 'loading';

    if (!$d.alreadyLoadUser) await $d.loadUser();

    mode.value = $d?._id ? 'ready' : 'no_user';
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
        margin-bottom: 64px;

        .banner {
            width: 100%;
            height: 215px;
            position: relative;
            border-radius: var(--hx-border-radius);
            background-color: #ffffff15;
            box-sizing: border-box;

            .avatar {
                position: absolute;
                left: 5%;
                bottom: -76px;
                border: 12px solid var(--hx-background-primary);
                background-color: var(--hx-background-primary);;
            }

            & + div {
                margin: 12px 0 32px 227px;
            }
        }

        .avatar {
            margin-right: 12px;
            max-width: 128px;
            min-width: 128px;
            max-height: 128px;
            min-height: 128px;
            position: relative;
            border-radius: var(--hx-border-radius);
            overflow: hidden;

            ::v-deep(.ui-image) {
                width: 100%;
                height: 100%;
                border-radius: var(--hx-border-radius);
            }
        }

        .name {
            font-size: 20px;
            font-weight: 600;
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