<template>
    <div class="login">
        <main>
            <h1>{{ $t("auth.title") }}</h1>

            <p>{{ $t("auth.description") }}</p>

            <template v-if="isLogin">
                <Label>{{ $t("email") }} / {{ $t("username") }}</Label>
                <Input
                    type="text"
                    placeholder="test@example.com or justname"
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

            <template v-if="!isLogin">
                <Label>{{ $t("repeatPassword") }}</Label>
                <Input
                    type="password"
                    placeholder="JDqdgw3203"
                    name="password"
                    v-model:value="repeatPassword"
                />

                <div class="password-valid">
                    <label>
                        <input type="checkbox" :checked="password.length > 8"/>
                        <span>{{ $t('passwordValid.0') }}</span>
                    </label>
                    <label>
                        <input type="checkbox" :checked="/(?=.*[a-z])/.test(password)"/>
                        <span>{{ $t('passwordValid.1') }}</span>
                    </label>
                    <label>
                        <input type="checkbox" :checked="/(?=.*[A-Z])/.test(password)"/>
                        <span>{{ $t('passwordValid.2') }}</span>
                    </label>
                    <label>
                        <input type="checkbox" :checked="/(?=.*\d)/.test(password)"/>
                        <span>{{ $t('passwordValid.3') }}</span>
                    </label>
                    <label>
                        <input type="checkbox" :checked="password.trim() !== '' && password === repeatPassword"/>
                        <span>{{ $t('passwordValid.4') }}</span>
                    </label>
                </div>
            </template>

            <Button
                variant="outline"
                :disabled="!isValidAuth"
                @click="onAuthUser"
            >
                <template v-if="isAuthing">
                    <Loader2 class="animation-spin"/>
                    <span>{{ $t('pleaseWait') }}...</span>
                </template>

                <template v-else>
                    <LogIn/>
                    <span>{{ $t(isLogin ? "signIn" : "signUp") }}</span>
                </template>
            </Button>

            <div style="margin: 4px 10%; border-top: 1px solid var(--hx-background-transparent);"></div>

            <NuxtLink class="or" :href="`/auth${isLogin ? '?reg=true' : ''}`">
                <span>{{ $t(isLogin ? "goToLogin" : "goToReg") }}</span>
            </NuxtLink>
        </main>
    </div>
</template>

<script lang="ts" setup>

// * Icons
import { LogIn, Loader2 } from "lucide-vue-next";


const $route = useRoute();

const $userAuth = useUserAuth();

const $onaTab = useOneTabStore();


if ($userAuth?.user?.value?._id) {
    await navigateTo("/", { external: true });
}


const regexUsername = /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{1,18}[a-zA-Z0-9]$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;


const email = ref<string>('');
const username = ref<string>('');
const password = ref<string>('');
const repeatPassword = ref<string>('');

const isAuthing = ref<boolean>(false);

const isLogin = computed(() => {
    return $route.query.reg === undefined;
});

const isValidAuth = computed(() => {
    if (isAuthing.value) return false;

    if (isLogin.value && ((!regexUsername.test(email.value) && !regexEmail.test(email.value)) || !regexPassword.test(password.value))) return false;

    if (!isLogin.value && (!regexEmail.test(email.value) || !regexUsername.test(username.value) || !regexPassword.test(password.value) || (password.value !== repeatPassword.value))) return false;
    // if (isLogin.value ? (!regexUsername.test(email.value) || !regexEmail.test(email.value)) : !regexEmail.test(email.value)) return false;

    // if (!email.value || email.value.trim() === "" || email.value.length < 3 || (isLogin.value ? false : !regexEmail.test(email.value))) return false;

    // if (!regexPassword.test(password.value)) return false;

    // if (!isLogin.value && (password.value !== repeatPassword.value)) return false;

    // if (!isLogin.value && (!username.value || username.value.trim() === "" || !regexUsername.test(username.value))) return false;

    return true;
});

async function onAuthUser() {
    if (!isValidAuth.value) return;

    isAuthing.value = true;

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

    isAuthing.value = false;

    // @ts-ignore
    if (data.value?.loggedIn === true || data.value?.registered === true) {
        await $userAuth.me();

        await navigateTo('/');

        $onaTab.emitter.emit('auth:user', data.value);
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
        box-shadow: 0 0 0 4px var(--hx-background-secondary);
        border-radius: var(--hx-border-radius);
        border: 1px solid var(--hx-background-transparent);
        flex-direction: column;
        gap: 8px;

        h1 {
            font-size: 20px;
            font-weight: 700;
        }

        p {
            font-size: 14px;
        }
    }

    .or {
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        opacity: 0.7;

        &:hover {
            text-decoration: underline;
            opacity: 1;
        }
    }

    .password-valid {
        display: flex;
        flex-direction: column;
        gap: 2px;

        label {
            pointer-events: none;
            display: flex;
            align-items: center;
            user-select: none;

            span {
                margin-left: 4px;
                font-size: 12px;
            }
        }
    }
}
</style>
