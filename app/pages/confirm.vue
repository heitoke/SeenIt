<template>
    <div>Waiting for login...</div>
</template>

<script lang="ts" setup>

const $user = useSupabaseUser();

watch($user, () => {
    if ($user.value) {
        return navigateTo('/');
    }
}, { immediate: true });

</script>