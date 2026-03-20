<template>
    <Tooltip>
        <template #trigger>
            <div class="badge"
                @click.stop.prevent=""
            >
                <EyeOff :size="size"/>
            </div>
        </template>

        <template #default v-if="!disabledTooltip">
            <span>{{ $t('privateMode') }}</span>
        </template>
    </Tooltip>
</template>

<script lang="ts" setup>

import { EyeOff } from 'lucide-vue-next';


interface Props {
    size?: number;
    disabledTooltip?: boolean;
}


const props = withDefaults(defineProps<Props>(), {
    size: 12,
    disabledTootip: false
});

</script>