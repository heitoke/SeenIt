<template>
    <header>
        <NuxtLink to="/">
            <div class="logo">
                <img src="/seen-it-dark-256x256.png" alt="Logo">
                <span>SeenIt</span>
            </div>
        </NuxtLink>

        <div style="margin-left: auto;"></div>

        <Language/>
        <Account/>
    </header>
</template>

<script lang="ts" setup>

// * Components
import Account from './Account.vue';
import Language from './Language.vue';

</script>

<style lang="scss" scoped>

header {
    display: flex;
    padding: 0 12px;
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

</style>