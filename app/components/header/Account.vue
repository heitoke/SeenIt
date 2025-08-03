<template>
    <div class="account">
        <DropdownMenu v-if="$user">
            <DropdownMenuTrigger as-child>
                <div class="avatar">
                    <img :src="$user.user_metadata.avatar_url" alt="User Avatar"></img>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
                <DropdownMenuLabel>@{{ $user.user_metadata.user_name }}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span>{{ $t('profile') }}</span>
                    </DropdownMenuItem>
                    <NuxtLink :to="`/u/${$user.id}`">
                        <DropdownMenuItem>
                            <span>{{ $t('dashboard') }}</span>
                        </DropdownMenuItem>
                    </NuxtLink>
                    <DropdownMenuItem>
                        <span>{{ $t('settings') }}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="signOut">
                    <span>{{ $t('logOut') }}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <NuxtLink to="/login" v-else>
            <Button>{{ $t('signIn') }}</Button>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>

const $supabase = useSupabaseClient();
const $user = useSupabaseUser();


async function signOut() {
    const { error } = await $supabase.auth.signOut();

    if (error) console.log(error)
}

</script>

<style lang="scss" scoped>

.account {
    position: relative;

    .avatar {
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 7px;
        background-color: var(--background-secondary);
        overflow: hidden;

        &:active {
            transform: scale(0.95);
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
}

</style>