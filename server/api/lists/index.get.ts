// * Types
import type { List } from '~~/types/db/list';

export default defineEventHandler(async (event) => {
    const payload = await $userAuth.require(event);
    
    const lists = await ListSchema.find<List>({ userId: payload._id });
    
    return lists;
});