<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <div><Heart :size="size"
                    :style="step > 0 ? `fill: ${currentStepColor}; stroke: ${currentStepColor};` : ''"
                /></div>
            </TooltipTrigger>
            <TooltipContent class="flex items-center p-0 overflow-hidden border-r-2" v-if="!disabledTooltip">
                <div v-for="(_, i) of new Array(5)" :key="i"
                    class="cursor-pointer flex items-center justify-center p-2"
                    
                    @click="$emit('updateStep', i)"
                >
                    <Heart :size="14" v-if="i > 0" :style="`fill: ${steps[i]}; stroke: ${steps[i]};`"/>
                    <HeartOff :size="14" v-else/>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script lang="ts" setup>

import { Heart, HeartOff } from 'lucide-vue-next';


interface Props {
    size?: number;
    step?: number;
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