<template>
    <label :class="['ui-input', type]">
        <input :type="type" v-model="value"
            :placeholder="placeholder"
            :min="min"
            :max="max"
            :maxlength="max"

            @input="$emit('input', $event as InputEvent)"
            @change="$emit('change', $event as InputEvent)"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)"
        >
    </label>
</template>

<script lang="ts" setup>

type Type = 'text' | 'number' | 'password';

type InputEvent = Event & { target: HTMLInputElement };


interface Props {
    type?: Type;
    disabled?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
}


const $slots = defineSlots<{
    before(): any;
    after(): any;
}>();


const value = defineModel('value', {
    set(v: string | number) {
        const { type, min, max } = props;

        if (type !== 'number' || typeof v !== 'number') return v;

        if (min && v < min) return min;
        if (max && v > max) return max;

        return v;
    },
});


const $emit = defineEmits({
    input(event: InputEvent) {
        return event;
    },
    change(event: InputEvent) {
        return event;
    },
    focus(event: FocusEvent) {
        return event;
    },
    blur(event: FocusEvent) {
        return event;
    }
});


const props = withDefaults(defineProps<Props>(), {
    type: 'text'
});

</script>

<style lang="css" scoped>

input {
    padding: 0;
    width: 100%;
    color: var(--text-primary);
    font-size: 14px;
    border: none;
    background-color: transparent;
    outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type='number'] {
    -moz-appearance: textfield;
}


.ui-input {
    display: flex;
    padding: 6px 10px;
    color: var(--hx-background-primary);
    font-size: 14px;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    align-items: center;
    justify-self: start;
    background-color: var(--hx-text-secondary);
    transition: box-shadow .2s;
    user-select: none;
    overflow: hidden;
}

.ui-input:has(> input:focus) {
    box-shadow: 0 0 0 2px var(--hx-background-secondary);
}

.before {
    margin-right: 4px;
}
.after {
    margin-left: 4px;
}


/* ? Type - number */
.ui-input.number {
    padding: 0;
}

.ui-input.number input {
    margin: 0 6px;
    text-align: center;
}

.number-btn {
    cursor: pointer;
    padding: 6px 10px;
    transition: filter .2s;
    background-color: var(--background-secondary);
}
.number-btn.l {
    border-right: 1px solid var(--background-t);
}
.number-btn.r {
    border-left: 1px solid var(--background-t);
}

.number-btn:hover {
    filter: brightness(0.9);
}

</style>