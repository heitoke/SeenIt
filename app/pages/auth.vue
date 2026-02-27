<template>
    <div class="login">
        <main>
            <h1>{{ $t('auth.title') }}</h1>

            <p>{{ $t('auth.description') }}</p>

            <template v-if="isLogin">
                <UILabel>{{ $t('email') }} / {{ $t('username') }}</UILabel>
                <UIInput type="text" placeholder="justname" name="email, username" v-model:value="email"/>
            </template>

            <template v-else>
                <UILabel>{{ $t('email') }}</UILabel>
                <UIInput type="text" placeholder="test@example.com" name="email" v-model:value="email"/>

                <UILabel>{{ $t('username') }}</UILabel>
                <UIInput type="text" placeholder="example" name="username" v-model:value="username"/>
            </template>

            <UILabel>{{ $t('password') }}</UILabel>
            <UIInput type="password" placeholder="JDqdgw3203" name="password" v-model:value="password"/>

            <UIButton variant="outline"
                :disabled="!isValidAuth"

                @click="onAuthUser"
            >
                <LogIn/>

                <span>{{ $t(isLogin ? 'signIn' : 'signUp') }}</span>
            </UIButton>

            <NuxtLink class="or" :href="`/auth${isLogin ? '?reg=true' : ''}`">
                <span>{{ $t(isLogin ? 'goToLogin' : 'goToReg') }}</span>
            </NuxtLink>
        </main>
    </div>
</template>

<script lang="ts" setup>

import { LogIn } from 'lucide-vue-next';

const $route = useRoute();

const $userAuth = useUserAuth();


if ($userAuth?.user?.value?._id) {
    await navigateTo('/', { external: true })
}


const email = ref<string>('');
const username = ref<string>('');
const password = ref<string>('');


const isLogin = computed(() => {
    return $route.query.reg === undefined;
});

const isValidAuth = computed(() => {
    if (!email.value || email.value.trim() === '' || email.value.length < 3) return false;
    if (!password.value || password.value.trim() === '' || password.value.length < 8) return false;
    if (!isLogin.value && (!username.value || username.value.trim() === '')) return false;

    return true;
});


async function onAuthUser() {
    if (!isValidAuth.value) return;

    const { data } = await useFetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        body: isLogin ? {
            login: email.value,
            password: password.value
        } : {
            email: email.value,
            username: username.value,
            password: password.value
        },
        method: 'POST'
    });

    // @ts-ignore
    if (data.value?.loggedIn === true || data.value?.registered === true) {
        $userAuth.me();

        await navigateTo('/');
    }
}

</script>

<style lang="scss" scoped>

.page.login {
    display: flex;
    width: 100%;
    height: calc(100vh - 128px);
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    main {
        display: flex;
        padding: 12px;
        width: 315px;
        border-radius: var(--hx-border-radius);
        border: 1px solid var(--hx-text-secondary);
        flex-direction: column;
        gap: 8px;

        h1 {
            font-size: 20px;
            font-weight: 700;
        }

        p {
            margin: 0 0 12px 0;
            font-size: 14px;
        }
    }

    .or {
        cursor: pointer;
        margin-top: 12px;
        font-size: 14px;
        text-align: center;
        opacity: .7;

        &:hover {
            text-decoration: underline;
            opacity: 1;
        }
    }
}

</style>