<template>
    <Header/>

    <NuxtPwaManifest/>

    <Transition name="fade">
        <NuxtPage class="page"/>
    </Transition>
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
    width: 100%;
    position: absolute;
    padding: 12px calc((100vw - 1256px) / 2) 32px calc((100vw - 1256px) / 2);
    transition: opacity .5s, transform .5s;
}

.fade-enter-active,
.fade-leave-active {
    transform: translateY(-64px);
    opacity: 0;
}

</style>