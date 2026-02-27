export default defineEventHandler(async (event) => {
    const users = await UserSchema.find().select('-password');
    
    return users;
});