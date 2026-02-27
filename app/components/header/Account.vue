<template>
    <div class="account">
        <UIPopover v-if="user?._id">
            <template v-slot="{ toggle }">
                <div class="avatar" @click.prevent.stop="toggle">
                    <span>{{ user?.username }}</span>

                    <img :src="`https://avatars.heito.xyz/beam/32/${user?._id}?square=false`"></img>
                </div>
            </template>

            <template #content>
                <UIMenu>
                    <NuxtLink :to="`/users/${user?._id}`">
                        <UIMenuButton>
                            <User/>

                            <span>{{ $t('profile') }}</span>
                        </UIMenuButton>
                    </NuxtLink>

                    <UIMenuButton>
                        <ScrollText/>

                        <span>{{ $t('dashboard') }}</span>
                    </UIMenuButton>

                    <UIMenuButton>
                        <Settings/>

                        <span>{{ $t('settings') }}</span>
                    </UIMenuButton>

                    <UIMenuSeparator/>

                    <UIMenuButton @click="logOut">
                        <LogOut/>

                        <span>{{ $t('logOut') }}</span>
                    </UIMenuButton>
                </UIMenu>
            </template>
        </UIPopover>

        <NuxtLink to="/auth" v-else>
            <UIButton>
                <ScanFace/>

                <span>{{ $t('signIn') }}</span>
            </UIButton>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>

import { User, ScrollText, Settings, LogOut, ScanFace } from 'lucide-vue-next';

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