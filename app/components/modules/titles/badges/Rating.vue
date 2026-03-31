<template>
    <Popover side="top">
        <template #default="{ show, hide }">
            <div :class="['badge', { edit: canEdit }]"
                @click.stop.prevent="show"

                @mouseenter="!canEdit && show($event)"
                @mouseleave="!canEdit && hide()"
            >
                <Star
                    :size="size"
                    :style="`fill: hsl(53.5, ${step * 10}%, 62.5%); stroke: hsl(53.5, ${step * 10}%, 62.5%);`"
                />
            </div>
        </template>

        <template #content>
            <div :class="['title-like', { edit: canEdit }]">
                <template v-if="canEdit">
                    <span>{{ $t('rating') }}?</span>

                    <div>
                        <div v-for="(_, i) of new Array(11)" :key="i"
                            :style="{ backgroundColor: step > 0 && step === i ? 'var(--hx-background-primary)' : '' }"
                            
                            @click="$emit('updateStep', i)"
                        >
                            <Star :size="14" :style="`fill: hsl(53.5, ${i * 10}%, 62.5%); stroke: hsl(53.5, ${i * 10}%, 62.5%);`"/>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <Star
                        :size="14"
                        :style="`fill: hsl(53.5, ${step * 10}%, 62.5%); stroke: hsl(53.5, ${step * 10}%, 62.5%);`"
                    />

                    <span>{{ $t('rating') }} - {{ step }}</span>
                </template>
            </div>
        </template>
    </Popover>
</template>

<script lang="ts" setup>

import { Star } from 'lucide-vue-next';


interface Props {
    size?: number;
    step?: number;
    canEdit?: boolean;
    disabledTooltip?: boolean;
}


const $emit = defineEmits({
    updateStep(step: number) {
        return step;
    }
})


const props = withDefaults(defineProps<Props>(), {
    size: 14,
    step: 0,
    canEdit: false,
    disabledTootip: false
});


// const steps = [
//     '',
//     '#ffbbad',
//     '#ff917a',
//     '#ff6647',
//     '#ff3b14'
// ];


// const currentStepColor = computed(() => steps[props.step]);

</script>

<style lang="scss" scoped>

.badge.edit {
    cursor: pointer;
}

.title-like {
    display: flex;

    &:not(.edit) {
        align-items: center;
        gap: 4px;

        span {
            font-size: 12px;
        }
    }

    &.edit {
        flex-direction: column;

        span {
            font-size: 10px;
            text-align: center;
            opacity: .5;
        }

        & > div {
            display: flex;
            align-items: center;
            overflow: hidden;

            div {
                cursor: pointer;
                display: flex;
                width: 24px;
                height: 24px;
                border-radius: var(--hx-border-radius);
                align-items: center;
                justify-content: center;

                &:hover {
                    background-color: #00000045;
                }
            }
        }
    }
}

</style>