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
            <div>
                <Input v-model:value="list.name" style="width: 100%;"/>

                <Checkbox name="view-mode-list" :label="$t('privateMode')"
                    style="margin: 12px 0;"
                    v-model="list.private"
                />

                <template v-if="list?.members?.length > 0">
                    <p style="font-size: 12px;">{{ $t('users') }}</p>

                    <div class="members" style="margin-top: 4px;">
                        <UserCard v-for="member of listMembers" :key="member.user?._id"
                            variant="compact"
                            :user="member?.user"
                            :text="'Host: ' + member?.host"
                        >
                            <template #after>
                                <Button variant="destructive" style="margin-left: auto;">
                                    <X/>
                                </Button>
                            </template>
                        </UserCard>
                    </div>
                </template>

                <ButtonGroup>
                    <InvateMembers v-slot="{ show }"
                        @invite="inviteMembers"
                    >
                        <Button variant="secondary" @click="show">
                            <UserPlus/>
                            <span>Add member</span>
                        </Button>
                    </InvateMembers>

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

// * Components
import InvateMembers, { type InvateMember } from '../members/Invate.vue';
import UserCard from '~/components/modules/card/User.vue';

// * Icons
import { UserPlus, Save, Trash, X } from 'lucide-vue-next';

// * Types
import type { List, Member } from '~~/types/db/list';
import type { User } from '~~/types/db/user';


const $dashboards = useDashboardsStore();


const props = defineProps<{
    userId: string;
    listId: string;
}>();


const list = ref<List>();
const listMembers = ref<Array<Omit<Member, 'user'> & { user: User }>>([]);


const $d = $dashboards.get(props.userId)!;


function onOpen(bool: boolean) {
    if (!bool || !props.userId || !props.listId) return;

    const _list = $d.lists.get(props.listId);

    if (!_list) return;

    list.value = _list.toObject();

    if (list.value?.members?.length > 0) {
        fetchListMembers();
    }
}

async function fetchListMembers() {
    if (list.value && listMembers.value.length > 0 && list.value?.members?.length > 0) return;

    for (const { host, user, permissions, addedAt } of list.value?.members!) {
        const data = await $fetch<User>(`http://${host}/api/users/${user}`);
        
        if (!data?._id) continue;

        listMembers.value.push({
            host,
            user: data,
            permissions,
            addedAt
        });
    }
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

async function inviteMembers(users: Array<InvateMember>) {
    const data = await $fetch(`/api/lists/${list?.value?._id}/members`, {
        body: {
            action: 'invite',
            members: users.map(user => ({
                userId: user.user?._id,
                host: user?.host
            }))
        },
        method: 'PUT'
    });

    console.log(data)
}

</script>