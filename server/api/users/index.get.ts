// * Types
import type { User } from '~~/types/db/user';

export default defineEventHandler(async (event) => {
    const users = await UserSchema.find<User>().select('-password');
    
    return users;
});