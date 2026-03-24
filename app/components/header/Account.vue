<template>
    <div class="account">
        <Popover style="width: 215px;" v-if="user?._id">
            <template v-slot="{ toggle }">
                <div class="avatar" @click.prevent.stop="toggle">
                    <span>{{ user?.username }}</span>

                    <img :src="getUrlAvatar(String(user?._id))"></img>
                </div>
            </template>

            <template #content>
                <Menu>
                    <NuxtLink :to="`/users/${user?._id}`">
                        <MenuButton>
                            <User/>

                            <span>{{ $t('profile') }}</span>
                        </MenuButton>
                    </NuxtLink>

                    <NuxtLink :to="`/users/${user?._id}/lists`">
                        <MenuButton>
                            <ScrollText/>

                            <span>{{ $t('dashboard') }}</span>
                        </MenuButton>
                    </NuxtLink>

                    <MenuSeparator/>

                    <MenuButton @click="logOut">
                        <LogOut/>

                        <span>{{ $t('logOut') }}</span>
                    </MenuButton>
                </Menu>
            </template>
        </Popover>

        <NuxtLink to="/auth" v-else>
            <Button>
                <ScanFace/>

                <span>{{ $t('signIn') }}</span>
            </Button>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>

import { User, ScrollText, LogOut, ScanFace } from 'lucide-vue-next';

const { user, logOut } = useUserAuth();

</script>

<style lang="scss" scoped>

.account {
    position: relative;

    .avatar {
        cursor: pointer;
        display: flex;
        align-items: center;
        overflow: hidden;
        gap: 8px;

        &:hover {
            span {
                text-decoration: underline;
            }
        }

        &:active {
            img {
                transform: scale(.9);
            }
        }

        span {
            font-size: 14px;
        }

        img {
            border-radius: var(--hx-border-radius);
            background-color: var(--background-secondary);
        }
    }
}

</style>