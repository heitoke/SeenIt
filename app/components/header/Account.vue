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
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <NuxtLink to="/app">
                        <DropdownMenuItem>
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                    </NuxtLink>
                    <DropdownMenuItem>
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="signOut">
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Button @click="signInWithOAuth" v-else>Sign In</Button>
    </div>
</template>

<script lang="ts" setup>

const $supabase = useSupabaseClient()
const $user = useSupabaseUser();


async function signInWithOAuth() {
    const url = useRequestURL();

    const { error } = await $supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${url.origin}/confirm`
        },
    });

    if (error) console.log(error);
}

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