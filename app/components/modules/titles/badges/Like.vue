<template>
    <Popover side="top">
        <template #default="{ show, hide }">
            <div :class="['badge', { edit: canEdit }]"
                @click.stop.prevent="show"

                @mouseenter="!canEdit && show($event)"
                @mouseleave="!canEdit && hide()"
            >
                <Heart
                    :size="size"
                    :style="step > 0 ? `fill: ${currentStepColor}; stroke: ${currentStepColor};` : ''"
                />
            </div>
        </template>

        <template #content>
            <div :class="['title-like', { edit: canEdit }]">
                <template v-if="canEdit">
                    <span>{{ $t('liked') }}?</span>

                    <div>
                        <div v-for="(_, i) of new Array(5)" :key="i"
                            :style="{ backgroundColor: step > 0 && step === i ? 'var(--hx-background-primary)' : '' }"
                            
                            @click="$emit('updateStep', i)"
                        >
                            <Heart :size="14" v-if="i > 0" :style="`fill: ${steps[i]}; stroke: ${steps[i]};`"/>
                            <HeartOff :size="14" v-else/>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <Heart
                        :size="14"
                        :style="step > 0 ? `fill: ${currentStepColor}; stroke: ${currentStepColor};` : ''"
                    />

                    <span>{{ $t('liked') }} - {{ step }}</span>
                </template>
            </div>
        </template>
    </Popover>
</template>

<script lang="ts" setup>

import { Heart, HeartOff } from 'lucide-vue-next';


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


const steps = [
    '',
    '#ffbbad',
    '#ff917a',
    '#ff6647',
    '#ff3b14'
];


const currentStepColor = computed(() => steps[props.step]);

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