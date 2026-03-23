<template>
    <div class="login">
        <main>
            <h1>{{ $t("auth.title") }}</h1>

            <p>{{ $t("auth.description") }}</p>

            <template v-if="isLogin">
                <Label>{{ $t("email") }} / {{ $t("username") }}</Label>
                <Input
                    type="text"
                    placeholder="justname"
                    name="email, username"
                    v-model:value="email"
                />
            </template>

            <template v-else>
                <Label>{{ $t("email") }}</Label>
                <Input
                    type="text"
                    placeholder="test@example.com"
                    name="email"
                    v-model:value="email"
                />

                <Label>{{ $t("username") }}</Label>
                <Input
                    type="text"
                    placeholder="example"
                    name="username"
                    v-model:value="username"
                />
            </template>

            <Label>{{ $t("password") }}</Label>
            <Input
                type="password"
                placeholder="JDqdgw3203"
                name="password"
                v-model:value="password"
            />

            <Button
                variant="outline"
                :disabled="!isValidAuth"
                @click="onAuthUser"
            >
                <LogIn />

                <span>{{ $t(isLogin ? "signIn" : "signUp") }}</span>
            </Button>

            <NuxtLink class="or" :href="`/auth${isLogin ? '?reg=true' : ''}`">
                <span>{{ $t(isLogin ? "goToLogin" : "goToReg") }}</span>
            </NuxtLink>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { LogIn } from "lucide-vue-next";

const $route = useRoute();

const $userAuth = useUserAuth();

if ($userAuth?.user?.value?._id) {
    await navigateTo("/", { external: true });
}


const regexUsername = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{1,18}[a-zA-Z0-9]$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;


const email = ref<string>("");
const username = ref<string>("");
const password = ref<string>("");

const isLogin = computed(() => {
    return $route.query.reg === undefined;
});

const isValidAuth = computed(() => {
    if (!email.value || email.value.trim() === "" || email.value.length < 3 || (isLogin.value ? false : !regexEmail.test(email.value))) return false;

    if (!password.value || password.value.trim() === "" || password.value.length < 8 || !regexPassword.test(password.value))return false;

    if (!isLogin.value && (!username.value || username.value.trim() === "" || !regexUsername.test(username.value))) return false;

    return true;
});

async function onAuthUser() {
    if (!isValidAuth.value) return;

    const { data } = await useFetch(`/api/auth/${isLogin.value ? "login" : "register"}`,
    {
        body: isLogin.value
            ? {
                login: email.value,
                password: password.value,
            } : {
                email: email.value,
                username: username.value,
                password: password.value,
            },
        method: "POST",
    });

    // @ts-ignore
    if (data.value?.loggedIn === true || data.value?.registered === true) {
        $userAuth.me();

        await navigateTo("/");
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
    }

    .or {
        cursor: pointer;
        margin-top: 12px;
        font-size: 14px;
        text-align: center;
        opacity: 0.7;

        &:hover {
            text-decoration: underline;
            opacity: 1;
        }
    }
}
</style>
