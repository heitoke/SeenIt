<template>
    <div class="user">
        <NuxtPage/>
    </div>
</template>

<script lang="ts" setup>

definePageMeta({
    name: 'user',
    alias: [
        '/u/:userId'
    ]
});

</script>

<style lang="scss" scoped></style>