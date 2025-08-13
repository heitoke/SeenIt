<template>
    <Dialog v-model:open="open" @update:open="onOpen">
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]" v-if="list">
            <DialogHeader>
                <DialogTitle>{{ list?.name }}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>

            <Input v-model="list.name"/>

            <div class="flex items-center space-x-2">
                <Switch id="airplane-mode" v-model="list.private"/>
                <Label for="airplane-mode">{{ $t('privateMode') }}</Label>
            </div>

            <DialogFooter>
                <Button variant="destructive"
                    @click="onDeleteList"
                >
                    <Trash/>
                    <span>{{ $t('delete') }}</span>
                </Button>

                <Button
                    @click="onSaveList"
                >
                    <Save/>
                    <span>{{ $t('save') }}</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

import { Save, Trash } from 'lucide-vue-next';

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { List } from '~~/types/list';


const $lists = useListsStore();


const props = defineProps<{
    userId: number;
    listId: number;
}>();


const open = ref(false);
const list = ref<List>();


function onOpen(bool: boolean) {
    if (!bool || !props.userId || !props.listId) return;

    const $cl = $lists.get(props.userId)!;

    const l = $cl.get('list', props.listId);

    if (!l) return;

    list.value = { ...l };
}


async function onSaveList() {
    if (!list.value) return;

    const { name, private: privateMode } = list.value;

    const r = await list.value.update!({ name, private: privateMode });

    if (!r) return;

    open.value = false;
}

async function onDeleteList() {
    if (!list.value) return;

    const r = await list.value.delete!();

    if (!r) return;

    open.value = false;
}

</script>