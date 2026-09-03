<template>
    <div></div>
</template>

<script lang="ts" setup>

const { user, d: $d } = useUserAuth();


onMounted(async () => {
    if (!$d.alreadyFetchUser) {
        await $d.fetchUser();
    }

    navigateTo(user.value?._id ? `/u/${user.value._id}/lists` : '/');
});


</script>