<template>
    <header>
        <NuxtLink to="/">
            <div class="logo">
                <img src="/seen-it-dark-256x256.png" alt="Logo">
                <span>SeenIt</span>
            </div>
        </NuxtLink>

        <NuxtLink to="/users">
            <span class="link">{{ $t('users') }}</span>
        </NuxtLink>

        <Popover>
            <template #default="{ show }">
                <div class="menu-links"
                    @click="show"
                >
                    <IconMenu :size="16"/>
                </div>
            </template>

            <template #content>
                <Menu>
                    <NuxtLink to="/users">
                        <MenuButton>
                            <span>{{ $t('users') }}</span>
                        </MenuButton>
                    </NuxtLink>
                </Menu>
            </template>
        </Popover>

        <div style="margin-left: auto;"></div>

        <Language/>
        
        <div class="open-notifications" v-if="user?._id"
            @click="$notifications.setOpen()"
        >
            <Bell :size="14"/>
        </div>

        <Account/>
    </header>
</template>

<script lang="ts" setup>

// * Components
import Account from './Account.vue';
import Language from './Language.vue';

import { Bell, Menu as IconMenu } from 'lucide-vue-next';


const { $notifications } = useNotificationsStore();

const { user } = useUserAuth();

</script>

<style lang="scss" scoped>

header {
    display: flex;
    margin: 0 auto;
    max-width: 1280px;
    height: 48px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    gap: 12px;
}

.logo {
    display: flex;
    align-items: center;

    &:hover {
        text-decoration: underline;
    }

    img {
        margin-right: 8px;
        width: 42px;
        filter: invert(1);
    }

    span {
        font-weight: 700;
    }
}

.menu-links {
    display: none;
}

.link {
    font-size: 14px;
    opacity: .7;

    &:hover {
        text-decoration: underline;
        opacity: 1;
    }
}

.open-notifications {
    cursor: pointer;
    transition: .2s;
    opacity: .5;

    &:hover {
        opacity: 1;
    }
}

@media (max-width: 1280px) {
    header {
        margin: 0 12px;
    }
}

@media (max-width: 400px) {
    .menu-links {
        display: block;
    }
    .link {
        display: none;
    }
}

</style>