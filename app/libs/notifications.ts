// * Libs
import { ConvertLog } from './convertLog';

// * Types
import type { Log } from '~~/types/db/log';
import type { Notification, NotificationTemplate } from '~~/types/stores/notications';


export class StoreNotification {
    private data: Notification;

    constructor(notification: Notification) {
        this.data = notification;
    }

    public get id() {
        return this.data.id;
    }

    public get hidden() {
        return this.data.hidden;
    }

    public get createdAy() {
        return new Date(this.data.createdAt);
    }


    public get name() {
        return this.data?.name;
    }

    public get title() {
        return this.data?.title;
    }

    public get text() {
        return this.data?.text;
    }

    public get icon() {
        return this.data?.icon;
    }

    public get image() {
        return this.data?.image;
    }

    public get color() {
        return this.data?.color;
    }

    public get buttons() {
        return this.data?.buttons || [];
    }

    public get group() {
        return this.data?.group;
    }

    public get mode() {
        return this.data?.mode;
    }


    public hide() {
        this.data.hidden = false;
    }

    public show() {
        this.data.hidden = true;
    }
}

export class Notifications extends Array<StoreNotification> {
    private open: boolean = false;

    constructor() {
        super();
    }


    public get isOpened() {
        return this.open;
    }

    public setOpen(bool?: boolean) {
        this.open = bool !== undefined ? bool : !this.open;
    }


    private getIndex(notifyId: number) {
        return this.findIndex(notify => notify.id === notifyId);
    }

    public has(notifyId: number) {
        return this.getIndex(notifyId) >= 0;
    }

    public get(notifyId: number) {
        return this.find(notify => notify.id === notifyId) || null;
    }


    private create(notification: Partial<NotificationTemplate>, hidden: boolean = true) {
        return new StoreNotification({
            ...notification,
            id: this.length,
            hidden,
            createdAt: Date.now()
        })
    }

    public add(notifications: Array<Partial<NotificationTemplate>>, hidden: boolean = true) {
        for (const notification of notifications) {
            this.push(this.create(notification, hidden));
        }

        return true;
    }

    public convertLogs(logs: Array<Omit<Log, 'user'>>, hidden: boolean = true) {
        for (const log of logs) {
            const { notificationTemplate } = new ConvertLog(log);

            if (!notificationTemplate) continue;

            this.push(this.create(notificationTemplate, hidden));
        }
    }


    public searchByName(name: string) {
        const index = this.findIndex(notify => notify.name === name);

        if (index < 0) throw null;

        return this[index];
    }


    public show(...notifyIds: Array<number>) {
        for (const notifyId of notifyIds) {
            const index = this.getIndex(notifyId);

            if (index < 0) continue;

            this[index]?.show();
        }

        return true;
    }

    public hide(...notifyIds: Array<number>) {
        for (const notifyId of notifyIds) {
            const index = this.getIndex(notifyId);

            if (index < 0) continue;

            this[index]?.hide();
        }

        return true;
    }

    public remove(...notifyIds: Array<number>) {
        for (const notifyId of notifyIds) {
            const index = this.getIndex(notifyId);

            if (index < 0) continue;

            this.splice(index, 1);
        }

        return true;
    }
}