<template>
    <Tooltip>
        <template #trigger>
            <div class="parent">В <b>{{ title.parentCategory?.name }}</b></div>
        </template>

        <template #default>
            Список: <b>{{ title?.parentCategory?.parentList?.name }}</b>
            <br>
            Категория: <b>{{ title?.parentCategory?.name }}</b>
        </template>
    </Tooltip>
</template>

<script lang="ts" setup>

// * Types
import type { DashboardTitle } from '~/libs/dashboard';


const props = defineProps<{
    title: DashboardTitle;
}>();

</script>

<style lang="scss">

.parent {
    padding: 0 6px;
    max-width: 50%;
    height: 20px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    color: var(--hx-text-primary);
    border-radius: var(--hx-border-radius);
    background-color: #00000045;
    backdrop-filter: blur(5px);
    box-sizing: border-box;
    transition: .2s;
    overflow: hidden;
    z-index: 2;
}

</style>