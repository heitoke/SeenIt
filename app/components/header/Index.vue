<template>
    <header>
        <div class="logo">SeenIt</div>

        <Account/>
    </header>
</template>

<script lang="ts" setup>

// * Components
import Account from './Account.vue';

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
}

</style>