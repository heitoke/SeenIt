<template>
    <Header/>

    <NuxtPage class="page"/>
</template>

<script setup lang="ts">

// * Components
import Header from '~/components/header/Index.vue';


useSeoMeta({
    title: 'SeenIt',
    description: ''
});

useHead({
    htmlAttrs: {
        class: 'dark'
    }
});

</script>

<style lang="scss">

.page {
    padding: 0 12px;
    margin: 12px auto 64px auto;
    max-width: 1280px;
}

</style>