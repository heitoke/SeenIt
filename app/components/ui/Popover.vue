<template>
    <slot
        :show="show"
        :hide="hide"
        :toggle="toggle"
        :isOpened="isOpened"
    />

    <Teleport to="body">
        <Transition
            :name="typeof transition === 'string' ? transition : transition?.name"
    
            @before-enter="onEnter"
            @after-leave="onLeave"
        >
            <div v-if="isOpened"
                :class="['ui-popover', ...popoverSide]"
                role="dialog"
                aria-modal="true"
                :style="style"
            >
                <slot name="content"/>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>

import type { HTMLAttributes } from 'vue';

// * Types
export type Side = 'top' | 'right' | 'bottom' | 'left';

export type Align = 'start' | 'center' | 'end';

interface DefaultSlotProps {
    show(event: MouseEvent): void;
    hide(): void;
    toggle(event: MouseEvent): void;
    isOpened: boolean;
}

type TransitionOptions = string | {
    name: string;
};



const $slots = defineSlots<{
    default(props: DefaultSlotProps): void;
    content(): void;
}>();

const $emit = defineEmits<{
    (e: 'show'): void;
    (e: 'hide'): void;
}>();

const props = withDefaults(defineProps<{
    side?: Side | [Side, Align];
    transition?: TransitionOptions;
    collisionPadding?: number | [number, number];
    closeOnClickOutside?: boolean;
    style?: HTMLAttributes['style'];
}>(), {
    side: () => 'bottom',
    transition: () => 'show',
    collisionPadding: () => 4,
    closeOnClickOutside: true,
    style: ''
});


const isOpened = ref<boolean>(false);
const reSide = ref<Side | null>(null);


const popoverSide = computed(() => {
    const side = typeof props.side === 'string' ? [props.side, 'center'] : props.side;

    if (reSide.value !== null) side[0] = reSide.value;

    return side as [Side, Align];
});


// ? Events
let targetEvent: MouseEvent | null = null;

let scrollHandler: (() => void) | null = null;
let clickHandler: ((event: MouseEvent) => void) | null = null;



// ? Update IsOpened
function show(event: MouseEvent) {
    isOpened.value = true;

    targetEvent = event;

    $emit('show');
}

function hide() {
    isOpened.value = false;

    targetEvent = null;

    $emit('hide');
}

function toggle(event: MouseEvent) {
    if (isOpened.value) hide();
    else show(event);
}


// ? Set position
function setMenuPosition(target: HTMLElement, menu: HTMLElement) {
    if (!target || !menu) return;

    const { width, height, x, y, top, left, right, bottom } = target?.getBoundingClientRect();
    const { width: menuWidth, height: menuHeight } = menu?.getBoundingClientRect();
    
    const [side] = popoverSide.value;
    const [horizontal, vertical] = typeof props.collisionPadding === 'number' ?
        [props.collisionPadding, props.collisionPadding] : props.collisionPadding;

    reSide.value = null;

    if (side === 'top' && (top - menuHeight - vertical) < 0) {
        reSide.value = 'bottom';
    } else if (side === 'left' && (left - menuWidth - horizontal) < 0) {
        reSide.value = 'right';
    } else if (side === 'bottom' && (menuHeight + bottom) > window.innerHeight) {
        reSide.value = 'top';
    } else if (side === 'right' && (menuWidth + right) > window.innerWidth) {
        reSide.value = 'left';
    }

    menu.style.setProperty('--gap-h', `${horizontal}px`);
    menu.style.setProperty('--gap-v', `${vertical}px`);
    menu.style.setProperty('--target-width', `${width}px`);
    menu.style.setProperty('--target-height', `${height}px`);
    menu.style.setProperty('--target-x', `${x}px`);
    menu.style.setProperty('--target-y', `${y}px`);
}



// ? Event Listeners
function removeEventListeners() {
    scrollHandler && document.removeEventListener('scroll', scrollHandler);
    clickHandler && document.removeEventListener('click', clickHandler);

    scrollHandler = null;
    clickHandler = null;
}

function onEnter(element: Element) {
    if (!targetEvent) return;

    const target = targetEvent?.currentTarget as HTMLElement;


    scrollHandler = () => {
        if (!isOpened.value || !target) return;

        setMenuPosition(target, element as HTMLElement);
    }

    clickHandler = (event: MouseEvent) => {
        if (!props?.closeOnClickOutside) return;

        const path = event.composedPath?.() || (event as any).path;

        if (path?.includes(element)) return;

        hide();
    }


    document.addEventListener('scroll', scrollHandler, { capture: true, passive: true });
    

    nextTick(() => {
        setMenuPosition(target, element as HTMLElement);

        setTimeout(() => clickHandler && document.addEventListener('click', clickHandler), 10);
    });
}

function onLeave() {
    removeEventListeners();
    
    targetEvent = null;
    reSide.value = null;
}


// * hooks
onUnmounted(() => {
    onLeave();
});

</script>

<style lang="scss" scoped>

.show-enter-active,
.show-leave-active {
    opacity: 0;
}

.ui-popover {
    width: 215px;
    position: fixed;
    top: 0;
    left: 0;
    padding: 8px;
    border-radius: var(--hx-border-radius);
    border: 1px solid var(--hx-text-secondary);
    background-color: var(--hx-text-primary);
    transition: opacity .2s;
    box-sizing: border-box;
    z-index: 101;

    &.top { --v: calc(var(--target-y) - 100% - var(--gap-v)); }
    &.bottom { --v: calc(var(--target-y) + var(--target-height) + var(--gap-v)); }

    &.top,
    &.bottom {
        &.start { transform: translate(var(--target-x), var(--v)); }

        &.center { transform: translate(calc(var(--target-x) + (var(--target-width) / 2) - 50%), var(--v)); }

        &.end { transform: translate(calc(var(--target-x) + var(--target-width) - 100%), var(--v)); }
    }

    &.left { --h: calc(var(--target-x) - 100% - var(--gap-h)); }
    &.right { --h: calc(var(--target-x) + var(--target-width) + var(--gap-h)); }

    &.left,
    &.right {
        &.start { transform: translate(var(--h), var(--target-y)); }

        &.center { transform: translate(var(--h), calc(var(--target-y) + (var(--target-height) / 2) - 50%)); }

        &.end { transform: translate(var(--h), calc(var(--target-y) + var(--target-height) - 100%)); }
    }
}

</style>