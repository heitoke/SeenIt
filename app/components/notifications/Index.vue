<template>
    <div class="notifications" ref="root">
        <Transition name="bg">
            <div class="bg" v-if="$notifications.isOpened"
                @click="$notifications.setOpen(false)"
            ></div>
        </Transition>

        <div :class="['panel', $notifications.isOpened ? 'active blur' : '']">
            <AnimationHeight :showed="$notifications.isOpened">
                <header>
                    <span>Notifications</span>

                    <X :size="18" @click="$notifications.setOpen(false)"/>
                </header>
            </AnimationHeight>

            <ul class="list">
                <div class="plus" v-if="!$notifications.isOpened && getNotHides.length > 7">
                    +{{ getNotHides.length - 7 }}
                </div>

                <TransitionGroup name="notification" @enter="onEnterNotification">
                    <NotificationCard v-for="notification of getListNotifications" :key="notification.id"
                        :id="String(notification.id)"

                        :notification="(notification as any)"
                        :show-buttons="$notifications.isOpened"
                    
                        @click="$notifications.setOpen(true)"
                    />
                </TransitionGroup>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

// * Icons
import { X } from 'lucide-vue-next';


const { user } = useUserAuth();

const { $notifications } = useNotificationsStore();

const root = ref<HTMLElement | null>(null);


const getMaxCountNotifications = computed<number>(() => {
    const count = process.server ? 1 : Math.floor(window.innerHeight / 70) - 2;

    return count > 7 ? 7 : count;
});

const getListNotifications = computed(() => {
    const list = $notifications.filter(n => $notifications.isOpened ? true : !n.hidden);

    if ($notifications.isOpened) return list;

    return list.slice(0, getMaxCountNotifications.value);
});

const getNotHides = computed(() => {
    return $notifications.filter(n => !n.hidden);
});


watch(() => user.value?._id || '', (newValue: string) => {
    if (!newValue) return;

    fetchUserNotifications();
});



function onEnterNotification(el: Element) {
    const id = Number(el.id);

    if ($notifications.isOpened) return $notifications.hide(id);

    setTimeout(() => $notifications.hide(id), 7000);
}

async function fetchUserNotifications() {
    if (!user?.value?._id) return;

    const data = await $fetch(`/api/logs/notify`);

    if (data?.length < 1) return;

    $notifications.convertLogs(data);
}


onMounted(() => {
    fetchUserNotifications();
});

</script>

<style lang="scss" scoped>

.notification-enter-active,
.notification-leave-active {
    margin: 0;
    padding: 0;
    max-height: 0px;
    height: 0px;
    transform: scale(0.8);
    opacity: 0;
}


.notifications {
    display: grid;
    pointer-events: none;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 106;

    .bg {
        pointer-events: all;
        width: 100dvw;
        height: 100dvh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #00000055;
        transition: .2s;
        z-index: 1;

        &-enter-active,
        &-leave-active {
            opacity: 0;
        }
    }

    .panel {
        display: flex;
        width: 376px;
        max-height: 100vh;
        min-height: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        flex-direction: column;
        border-left: 1px solid transparent;
        transition: all .5s;
        z-index: 2;
        
        &:not(.active) {
            &.top {
                align-self: flex-start;

                &.center { align-self: center; }
            }

            &.right {
                justify-self: flex-end;

                &.center { justify-self: center; }
            }

            &.bottom {
                align-self: flex-end;

                &.center { align-self: center; }
            }

            &.left {
                justify-self: flex-start;

                &.center { justify-self: center; }
            }

            ul.list {
                display: grid;
                margin: 2%;

                .notification {
                    border-color: var(--hx-background-secondary);

                    &:not(:last-child) {
                        margin-bottom: 8px;
                    }
                }

                .plus {
                    margin: 0 0 8px auto;
                    padding: 4px 8px;
                    color: var(--hx-text-secondary);
                    font-size: 10px;
                    border-radius: 5px;
                    border: 1px solid var(--background-secondary-alt);
                    background-color: var(--background-secondary);
                }
            }
        }

        &.active {
            pointer-events: all;
            min-height: 100vh;
            border-left: 1px solid var(--hx-background-secondary);
            // background-color: ;
            backdrop-filter: blur(5px);

            ul.list {
                margin: 12px 12px 0 12px;
                overflow-x: hidden;
            }
        }

        header {
            display: flex;
            margin: 0 12px;
            padding: 12px;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--hx-background-secondary);
            box-sizing: border-box;

            span {
                font-size: 18px;
                font-weight: 500;
            }

            .lucide {
                cursor: pointer;
                opacity: .5;

                &:hover {
                    color: var(--hx-color-red);
                    opacity: 1;
                }
            }
        }

        ul.list {
            flex: 1;
            transition: all .2s;

            .notification {
                cursor: pointer;
                pointer-events: all;
                max-width: 100%;
                border: 1px solid transparent;
                background-color: #ffffff05;
                // transform-origin: v-bind('$notifications.position');
                transition: all .3s;

                &:not(:last-child) {
                    margin-bottom: 8px;
                }
            }
        }
    }
}

</style>