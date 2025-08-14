<template>
    <div>Waiting for login...</div>
</template>

<script lang="ts" setup>

// * Stores
import { useCacheUsersStore } from '~/stores/cacheUsers';


const $user = useSupabaseUser();


watch($user, async () => {
    if ($user.value) {
        return navigateTo(`/users/${$user.value?.app_metadata?.public_id}`);
    }
}, { immediate: true });

</script>