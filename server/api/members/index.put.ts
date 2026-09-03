import { createError } from 'h3';
import bcrypt from 'bcryptjs';

// * Types
import type { List } from '~~/types/db/list';
import { LogCode } from '~~/types/db/log';
import { User } from '~~/types/db/user';


interface BodyTemplate<Type> {
    action: Type;
}

interface BodyListInvite extends BodyTemplate<'list:invite'> {
    host: string;
    inviter: User;
    invited: string;
    list: List;
}

interface BodyListInvited extends BodyTemplate<'list:invited'> {
    userId: string;
    code: string;
    result: 'accept' | 'reject';
}

type Body = BodyListInvite | BodyListInvited;



export default defineEventHandler(async (event) => {
    const body = await readBody(event) as Body;
    
    if (body.action === 'list:invite') {
        const { host, inviter, invited, list } = body;

        const hostUser = await UserSchema
            .findOne({ _id: String(invited) })
            .select('-password')
            .lean();

        if (!hostUser) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not found user!'
            });
        }

        const code = await bcrypt.hash(`${invited}:${inviter?._id}:${list?._id}`, 1);

        await createLog(String(invited), LogCode.List.InvitedMember, {
            list: list,
            inviter: inviter,
            host,
            code
        });

        return {
            success: true,
            code,
            inviterId: inviter?._id,
            invited: hostUser,
            listId: list?._id
        };
    } else if (body.action === 'list:invited') {
        const { userId, code, result } = body;

        const log = await LogSchema.findOne({
            user: String(userId),
            'props.code': String(code)
        });

        if (!log) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not found log by code!'
            });
        }

        log.code = LogCode.List[result === 'accept' ? 'InviteMemberAccept' : 'InviteMemberReject'];

        await log.save();

        if (result === 'accept') {
            const list = await ListSchema.findOne({ _id: { $in: log?.props?.list?._id } });

            if (!list) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Not found list'
                });
            }

            list.members.push({
                user: new LogObjectId(String(log?.props?.invited?._id)),
                host: String(log?.props?.host),
                permissions: 0
            });

            await list.save();
        }

        return {
            success: true,
            code,
            result
        };
    }

    return createError({
        statusCode: 400,
        data: {
            success: false
        }
    });
});