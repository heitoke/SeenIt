<template>
    <Header/>
    
    <Transition name="fade">
        <NuxtPage class="page"/>
    </Transition>
</template>

<script lang="ts" setup>

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
    margin-left: auto;
    margin-right: auto;
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