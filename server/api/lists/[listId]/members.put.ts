import { createError } from 'h3';
import bcrypt from 'bcryptjs';

// * Types
import type { List } from '~~/types/db/list';
import { LogCode } from '~~/types/db/log';

interface Body {
    action: 'invite';
    members: Array<{
        userId: string;
        host: string;
    }>;
}



export default defineEventHandler(async (event) => {
    const $user = await $userAuth.require(event);
    
    const listId = await getRouterParam(event, 'listId');

    const list = await ListSchema
        .findOne({ _id: String(listId) })
        .select('-__v -members');

    if (!list) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found!'
        });
    }

    const { action, members } = await readBody(event) as Body;

    if (action === 'invite') {
        const hostUsers = members.filter(m => m.host === 'host');

        if (hostUsers.length > 0) {
            const listHostUsers = hostUsers.length > 0 ? await UserSchema
                .find({
                    _id: { $in: hostUsers.map(m => String(m.userId)) }
                })
                .lean()
            : [];

            for (const user of listHostUsers) {
                const code = await bcrypt.hash(`${$user._id}:${user._id}:${list._id}`, 1);

                await createLog(String($user._id), LogCode.List.InviteMember, {
                    list: list.toObject(),
                    invited: user,
                    code
                });

                await createLog(String(user._id), LogCode.List.InvitedMember, {
                    list: list.toObject(),
                    inviter: $user,
                    code
                });
            }
        }

        const networkUsers = members.filter(m => m.host !== 'host');

        if (networkUsers.length > 0) {
            const hostUrl = event.req.headers['host'];

            for (const { userId, host } of networkUsers) {
                const res = await $fetch<any>(`http://${host}/api/members`, {
                    body: JSON.stringify({
                        action: 'list:invite',
                        host: hostUrl,
                        inviter: $user,
                        invited: userId,
                        list
                    }),
                    method: 'PUT'
                });

                if (!res?.success) return;
                
                await createLog(String($user._id), LogCode.List.InviteMember, {
                    list: list.toObject(),
                    invited: res?.invited,
                    host,
                    code: res.code
                });
            }
        }

        return { success: true };
    }

    return { success: false, result: null };
});