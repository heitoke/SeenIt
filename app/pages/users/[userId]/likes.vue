<template>
    <div class="user-likes">
        Soon
    </div>
</template>

<script lang="ts" setup>

// * Types
import type { User } from '~~/types/user';


const $user = useSupabaseUser();



const props = defineProps<{
    user: User;
    canEdit: boolean;
}>();


onMounted(async () => {
});


definePageMeta({
    name: 'user-likes',
    alias: [
        '/u/:userId/likes'
    ]
});

</script>

<style lang="scss" scoped>

</style>