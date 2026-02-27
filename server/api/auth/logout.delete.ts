export default defineEventHandler(async (event) => {
    return await $userAuth.logOut(event);
});