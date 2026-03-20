<template>
    <Dialog
        :title="category && category?.name"

        @update:open="onOpen"
    >
        <template v-slot="{ show, hide }">
            <slot :show="show" :hide="hide"/>
        </template>

        <template v-if="category"
            v-slot:content="{ hide }"
        >
            <div style="width: 376px;">
                <Input v-model:value="category.name"/>

                <Checkbox name="view-mode-list" :label="$t('privateMode')"
                    style="margin: 12px 0;"
                    v-model="category.private"
                />

                <ButtonGroup>
                    <Button variant="destructive" @click="onDelete(hide)">
                        <Trash/>
                        <span>{{ $t('delete') }}</span>
                    </Button>

                    <Button @click="onSave(hide)">
                        <Save/>
                        <span>{{ $t('save') }}</span>
                    </Button>
                </ButtonGroup>
            </div>
        </template>
    </Dialog>
</template>

<script lang="ts" setup>

import { Save, Trash } from 'lucide-vue-next';

// * Types
import type { List } from '~~/types/db/list';
import type { Category } from '~~/types/db/category';


const $dashboards = useDashboardsStore();


const props = defineProps<{
    userId: string;
    categoryId: string;
}>();


const category = ref<Category>();


const $d = $dashboards.get(props.userId);


function onOpen(bool: boolean) {
    if (!bool || !props.userId || !props.categoryId) return;

    if (!$d?.list) return;

    const _category = $d.categories.get(props.categoryId);

    if (!_category) return;

    category.value = _category.toObject();
}


async function onSave(hide: () => void) {
    if (!category.value) return;

    const { name, private: privateMode } = category.value;

    const result = await $d.categories.get(category.value._id)?.update({
        name,
        private: privateMode
    });

    if (!result) return;

    hide();
}

async function onDelete(hide: () => void) {
    if (!category.value) return;

    const result = await $d.categories.get(category.value._id)?.delete();

    if (!result) return;

    hide();
}

</script>