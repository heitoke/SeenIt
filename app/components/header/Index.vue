<template>
    <header>
        <NuxtLink to="/">
            <div class="logo">SeenIt</div>
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

</style>