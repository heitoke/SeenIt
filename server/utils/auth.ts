// * Types
import type { H3Event } from 'h3';


class UserAuth {
    async get(event: H3Event) {
        const { data } = await $useSession(event);

        return data.id;
    }

    async set(event: H3Event, userId: string) {
        const token = await createJWT(userId);

        return await $useSession(event, token);
    }

    async logOut(event: H3Event) {
        const session = await $useSession(event);

        return session.clear(); 
    }
    
    async getUser(event: H3Event) {
        const token = await this.get(event);

        if (!token) return null;

        const payload = await verifyJWT(token);

        const user = await UserSchema.findOne({ _id: payload.id }).select('-password');

        return user?.toJSON();
    }

    async require(event: H3Event) {
        const token = await this.get(event);

        if (!token) throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized - invalid token'
        });
        
        const payload = await verifyJWT(token);

        const user = await UserSchema.findOne({ _id: payload.id }).select('-password');

        if (!user) throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized - invalid token'
        });

        return user.toJSON();
    }
}


export const $userAuth = new UserAuth();