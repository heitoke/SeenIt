// * Libs
import { Notifications } from '~/libs/notifications';


export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = reactive(new Notifications());

    return {
        $notifications: notifications
    };
});