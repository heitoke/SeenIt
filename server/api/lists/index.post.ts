import { createError } from 'h3';

export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);

    const { name } = await readBody(event) as { name: string };
    
    const newList = await new ListSchema({
        user: $user._id,
        name,
        private: false
    });
    
    await newList.save();
    
    return newList;
});