<template>
    <Dialog
        :title="list && list?.name"

        @update:open="onOpen"
    >
        <template v-slot="{ show, hide }">
            <slot :show="show" :hide="hide"/>
        </template>
        
        <template v-if="list"
            v-slot:content="{ hide }"
        >
            <div style="width: 376px;">
                <Input v-model:value="list.name"/>

                <Checkbox name="view-mode-list" :label="$t('privateMode')"
                    style="margin: 12px 0;"
                    v-model="list.private"
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


const $dashboards = useDashboardsStore();


const props = defineProps<{
    userId: string;
    listId: string;
}>();


const list = ref<List>();


const $d = $dashboards.get(props.userId)!;


function onOpen(bool: boolean) {
    if (!bool || !props.userId || !props.listId) return;

    const _list = $d.lists.get(props.listId);

    if (!_list) return;

    list.value = _list.toObject();
}


async function onSave(hide: () => void) {
    if (!list.value) return;

    const { name, private: privateMode } = list.value;

    const result = await $d.lists.get(list.value?._id)?.update({
        name,
        private: privateMode
    });

    if (!result) return;

    hide();
}

async function onDelete(hide: () => void) {
    if (!list.value) return;

    const result = await $d.lists.get(list.value?._id)?.delete();

    if (!result) return;

    hide();
}

</script>