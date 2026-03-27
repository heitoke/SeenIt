// * Types
import type { List } from '~~/types/db/list';
import { type Log, LogCode } from '~~/types/db/log';
import type { User } from '~~/types/db/user';
import type { NotificationTemplate } from '~~/types/stores/notications';


export interface ListInviteMemberProps {
    list: Pick<List, '_id' | 'name'>;
    invited: Pick<User, '_id' | 'username'>;
    host: string;
    code: string;
}

export interface ListInvitedMemberProps extends Omit<ListInviteMemberProps, 'invited'> {
    inviter: Pick<User, '_id' | 'username'>;
}


export class ConvertLog {
    constructor(public log: Omit<Log, 'user'>) {}

    public get notificationTemplate() {
        if (this.log.code === LogCode.List.InviteMember) {
            return this.toListInviteMember();
        } else if (this.log.code === LogCode.List.InvitedMember) {
            return this.toListInvitedMember();
        }

        return null;
    }

    
    private toListInviteMember(): Partial<NotificationTemplate> {
        const { list, invited } = this.log.props as ListInviteMemberProps;

        return {
            image: getUrlAvatar(String(invited._id)),
            title: 'Приглошение в список ',
            text: 'Ожидайте ответа на приглашение'
        };
    }

    private toListInvitedMember(): Partial<NotificationTemplate> {
        const { list, inviter, host } = this.log.props as ListInvitedMemberProps;

        const send = async (result: 'accept' | 'reject') => {
            const data = await $fetch(`/api/logs/notify/${this.log._id}`, {
                body: JSON.stringify({
                    action: result
                }),
                method: 'PUT'
            });

            console.log(data)
        }

        return {
            image: getUrlAvatar(String(inviter._id)),
            title: 'Приглошение в список ',
            text: `Пользователь <${host}@${inviter.username}> пригласил вас в свой список <${list.name}>`,
            buttons: [
                {
                    label: 'Принять',
                    click: () => {
                        send('accept');
                    }
                },
                {
                    label: 'Отклонить',
                    click: () => {
                        send('reject');
                    }
                }
            ]
        };
    }
}