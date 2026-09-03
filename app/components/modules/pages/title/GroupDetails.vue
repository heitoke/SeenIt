<template>
    <div class="group-details">
        <h2>Детали просмотра</h2>
    </div>
</template>

<script lang="ts" setup>

// * Components

// * Types
import type { DashboardTitle } from '~/libs/dashboard';


const props = defineProps<{
    title: DashboardTitle;
}>();

</script>

<style lang="scss" scoped>

.group-media {
    margin-top: 24px;

    h2 {
        margin-bottom: 12px;
        font-size: 24px;
        font-weight: 600;
    }
}


</style>