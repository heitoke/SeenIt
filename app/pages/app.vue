<template>
    <div></div>
</template>

<script lang="ts" setup>

const $user = useSupabaseUser();

if ($user.value?.id) {
    navigateTo(`/u/${$user.value.app_metadata?.public_id}`);
}


definePageMeta({
    middleware: ['auth']
});

</script>