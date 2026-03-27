<template>
    <div :class="['user-card', variant]">
        <Image :src="getUrlAvatar(user?._id)" alt="User Avatar"/>

        <div>
            <div class="username">{{ user?.username || user?._id }}</div>
            <div class="text" v-show="text">{{ text }}</div>
        </div>

        <slot name="after"/>
    </div>
</template>

<script lang="ts" setup>

// * Components
import Image from '~/components/ui/Image.vue';

// * Types
import type { User } from '~~/types/db/user';

export type UserCardVariant = 'default' | 'compact';


const props = withDefaults(defineProps<{
    variant?: UserCardVariant;
    user: User;
    text?: string;
}>(), {
    variant: 'default'
});

</script>

<style lang="scss" scoped>

.user-card {
    display: flex;
    padding: 12px;
    align-items: center;
    border-radius: var(--hx-border-radius);
    border: 1px solid var(--hx-background-transparent);

    &:hover {
        .username {
            text-decoration: underline;
        }
    }

    &.compact {
        padding: 8px;

        :deep(.ui-image) {
            margin-right: 8px;
            width: 32px;
            height: 32px;
        }

        .username {
            font-size: 14px;
        }

        .text {
            margin: 0;
            font-size: 10px;
        }
    }

    :deep(.ui-image) {
        margin-right: 12px;
        width: 64px;
        height: 64px;
        border-radius: var(--hx-border-radius);
        object-fit: cover;
        object-position: center;
    }

    .username {
        font-weight: 600;
    }

    .text {
        margin-top: 2px;
        font-size: 14px;
        opacity: .5;
    }
}

</style>