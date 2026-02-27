export default defineEventHandler(async (event) => {
    const payload = await $userAuth.require(event);

    return { ...payload };
});