<template>
    <Dialog @update:open="onOpen">
        <DialogTrigger as-child>
            <slot/>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ list?.name }}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>

            <Input v-model="list.name"/>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>

// * Stores
import { useListsStore } from '~/stores/lists';

// * Types
import type { List } from '~~/types/list';


const $lists = useListsStore();


const props = defineProps<{
    listId: number;
}>();



const saveList = ref('');
const list = ref<Partial<List>>({});


function onOpen(bool: boolean) {
    if (!bool) return;

    const l = $lists.lists.find(l => l.id === props.listId);

    if (!l) return;

    saveList.value = JSON.stringify(l);
    list.value = l;
}

</script>