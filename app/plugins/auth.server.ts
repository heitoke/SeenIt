export default defineNuxtPlugin({
    name: 'seen-it-auth-plugin',
    async setup() {
        await useUserAuth().me();
    }
});