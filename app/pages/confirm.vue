<template>
    <div>Waiting for login...</div>
</template>

<script lang="ts" setup>

// * Stores
import { useListsStore } from '~/stores/lists';


const $user = useSupabaseUser();


watch($user, async () => {
    if ($user.value) {
        return navigateTo(`/users/${$user.value?.id}/lists`);
    }
}, { immediate: true });

</script>