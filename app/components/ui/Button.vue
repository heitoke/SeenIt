<template>
    <button :class="['ui-button', variant]"
        :disabled="disabled"

        @click="$emit('click', $event)"
    >
        <slot/>
    </button>
</template>

<script lang="ts" setup>

export type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';


const $slots = defineSlots<{
    default(): any;
    before(): any;
    after(): any;
}>();

const $emit = defineEmits({
    click(event: MouseEvent) {
        return event;
    }
});


const props = withDefaults(defineProps<{
    variant?: ButtonVariant;
    disabled?: boolean;
}>(), {
    variant: 'default',
    disabled: false
});

</script>

<style lang="css" scoped>

button {
    display: flex;
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
    user-select: none;
}

.ui-button {
    display: flex;
    padding: var(--hx-padding-xl);
    min-height: 32px;
    color: #000;
    align-items: center;
    justify-content: center;
    border-radius: var(--hx-border-radius);
    background-color: var(--hx-background-primary);
    box-sizing: border-box;
    transition: filter .2s, box-shadow .2s, background-color .2s;
    gap: 4px;
}

::v-deep(svg.lucide) {
    width: 16px;
    height: 16px;
}

.ui-button:disabled {
    cursor: not-allowed;
    filter: brightness(0.8);
    opacity: .7;
}

.ui-button:not(:disabled):hover {
    cursor: pointer;
    filter: brightness(0.8);
}

.ui-button:not(:disabled):active {
    filter: brightness(0.6);
}

.ui-button.outline:not(:disabled):active {
    box-shadow: 0 0 0 3px var(--background-secondary);
}

.ui-button:hover .content,
.ui-button:hover .after,
.ui-button:hover .before {
    z-index: 2;
}
.ui-button .content:hover,
.ui-button .after:hover,
.ui-button .before:hover {
    z-index: 1;
}



.ui-button:disabled .content,
.ui-button .before:disabled,
.ui-button .after:disabled {
    cursor: not-allowed;
    filter: brightness(0.7);
}



/* ? Destructive style */
.ui-button.destructive .content,
.ui-button.destructive .after,
.ui-button.destructive .before {
    background-color: var(--color-red);
}


/* ? Outline style */
.ui-button.outline {
    color: var(--hx-background-primary);
    border: 1px solid var(--hx-text-secondary);
    background-color: var(--hx-text-primary);
}

.ui-button.outline:has(.before) {
    border-left: none;

    &::before {
        content: ' ';
        position: absolute;
        width: 1px;
        height: 70%;
        top: 50%;
        left: 0;
        background-color: transparent;
        transform: translateY(-50%);
    }
}


/* ? Ghost style */
.ui-button.ghost {
    color: var(--text-primary);
    background-color: transparent;
}

.ui-button.ghost:hover {
    background-color: var(--hx-text-secondary);
}

</style>