<template>
    <template v-if="$route.name !== 'one-tab'">
        <Header/>
        <Notifications/>
        <!-- <OneTab/> -->
    </template>
    
    <Transition name="fade">
        <NuxtPage class="page"/>
    </Transition>
</template>

<script lang="ts" setup>

// * Components
import Header from '~/components/header/Index.vue';
import Notifications from '~/components/notifications/Index.vue';
// import OneTab from '~/components/oneTab/Index.vue';


const $route = useRoute();


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
    margin-top: 12px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 64px;
    max-width: 1280px;
    transition: opacity .5s, transform .5s;
}

.fade-enter-active,
.fade-leave-active {
    transform: translateY(-64px);
    opacity: 0;
}


@media (max-width: 1280px) {
    .page {
        padding: 12px 12px 32px 12px;
    }
}

</style>