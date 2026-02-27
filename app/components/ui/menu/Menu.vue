<template>
    <div class="ui-menu">
        <slot/>
    </div>
</template>

<script lang="ts" setup>

// * Components
// import MenuButton from '../modules/menu-components/Button.vue';

// * Types
export type MenuVariant = 'default' | 'compact';


const props = withDefaults(defineProps<{
    variant?: MenuVariant;
}>(), {
    variant: 'default'
});

</script>

<style lang="css" scoped>



</style>