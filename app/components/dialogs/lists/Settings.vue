<template>
    <Dialog v-model:open="open" @update:open="onOpen">
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ list?.name }}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>

            <Input v-model="list.name"/>

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
    userId: string;
    listId: number;
}>();


const open = ref(false);
const list = ref<Partial<List>>({});


function onOpen(bool: boolean) {
    if (!bool || !props.userId || !props.listId) return;

    const $cl = $lists.get(props.userId)!;

    const l = $cl.get('list', props.listId);

    if (!l) return;

    list.value = { ...l };
}


async function onSaveList() {
    if (!list.value) return;

    const r = await list.value.update!({ name: list.value.name! });

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