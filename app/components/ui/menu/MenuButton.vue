<template>
    <button class="ui-menu-button"
        :disabled="disabled"

        @click="$emit('click', $event)"
    >
        <slot/>
    </button>
</template>

<script lang="ts" setup>

const $emit = defineEmits({
    click(event: MouseEvent) {
        return event;
    }
});


const props = withDefaults(defineProps<{
    disabled?: boolean;
}>(), {
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

.ui-menu-button {
    display: flex;
    padding: var(--hx-padding-xl);
    width: 100%;
    min-height: 32px;
    color: var(--hx-background-primary);
    align-items: center;
    justify-content: start;
    border-radius: var(--hx-border-radius);
    background-color: transparent;
    box-sizing: border-box;
    transition: filter .2s, box-shadow .2s, background-color .2s;
    gap: 4px;
}

::v-deep(svg.lucide) {
    margin-right: 4px;
    width: 16px;
    height: 16px;
}

.ui-menu-button:disabled {
    cursor: not-allowed;
    filter: brightness(0.8);
    opacity: .7;
}

.ui-menu-button:not(:disabled):hover {
    cursor: pointer;
    background-color: var(--hx-text-secondary);
}

</style>