<template>
    <Header/>

    <NuxtPwaManifest/>

    <NuxtPage class="page"/>
</template>

<script setup lang="ts">

// * Components
import Header from '~/components/header/Index.vue';
import { useListsStore } from './stores/lists';


const $lists = useListsStore()


onMounted(() => {
    $lists.getMyData()
});


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