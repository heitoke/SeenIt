<template>
    <Dialog
        :title="title"
        :description="text"
    >
        <template v-slot="{ show, hide }">
            <slot :show="show" :hide="hide"/>
        </template>

        <template v-slot:content="{ hide }">
            <div class="dialog-content">
                <Label>{{ fieldText || $t('name') }}</Label>

                <Input
                    v-model:value="name"
                />
            </div>
        </template>
        
        <template v-slot:footer="{ hide }">
            <Button :disabled="!name"
                type="submit"
                @click="$emit('save', { name, hide })"
            >
                <Save/>
                <span>{{ btnText || $t('save') }}</span>
            </Button>
        </template>
    </Dialog>
</template>

<script lang="ts" setup>

// * Icons
import { Save } from 'lucide-vue-next';


export interface List {
    name: string;
    hide: () => void;
}


defineEmits({
    save(data: List) {
        return data;
    }
});


defineProps<{
    title?: string;
    text?: string;
    fieldText?: string;
    btnText?: string;
}>();


const name = ref('');

</script>

<style lang="scss" scoped>

.dialog-content {
    width: 256px;

    h2 {
        margin-bottom: 12px;
    }

    .ui-button {
        margin-top: 12px;
    }
}

</style>