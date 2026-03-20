<template>
    <div class="users">
        <div class="list">
            <NuxtLink v-for="user of users" :key="user._id"
                :to="`/u/${user._id}`"
            >
                <div class="user">
                    <img :src="getUrlAvatar(user._id)" alt="User Avatar">

                    <div>
                        <div class="name">{{ user.username }}</div>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type { User } from '~~/types/db/user';


const users = ref<Array<User>>([]);



async function getListUsers() {
    const data = await $fetch('/api/users');

    if (!data) return;

    console.log(data);
    
    users.value = data;
}


onMounted(() => {
    getListUsers();
});

</script>

<style lang="scss" scoped>

.page.users {
    .list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .user {
            cursor: pointer;
            display: flex;
            padding: 12px;
            align-items: center;
            border-radius: 10px;
            border: 1px solid var(--hx-background-transparent);

            &:hover {
                .name {
                    text-decoration: underline;
                }
            }

            img {
                margin-right: 12px;
                width: 64px;
                height: 64px;
                border-radius: 10px;
                object-fit: cover;
                object-position: center;
            }

            .name {
                font-weight: 600;
            }
        }
    }

    @media (max-width: 1080px) {
        .list {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 860px) {
        .list {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .list {
            grid-template-columns: 1fr;
        }
    }
}

</style>