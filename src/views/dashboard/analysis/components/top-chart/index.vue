<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:24">
      <n-space justify="space-around" size="large">
        <n-button class="mt-24px my-3 whitespace-pre-wrap" type="primary" @click="handleCreate">新建应用</n-button>
      </n-space>
      <n-divider>账户详情</n-divider>
    </n-grid-item>
    <n-grid-item v-if="appsRef.length === 0" span="0:24 640:24 1024:24" style="margin-bottom: 12px">
      <n-empty description="You can't find anything">
        <template #extra>
          <n-button size="small">暂无应用</n-button>
        </template>
      </n-empty>
    </n-grid-item>
    <template v-for="item in appsRef" v-else :key="item.id">
      <n-grid-item span="0:24 640:24 1024:6">
        <n-card :bordered="false" class="rounded-16px shadow-sm">
          <div class="w-full h-360px py-12px">
            <h3 class="text-16px font-bold">Dashboard</h3>
            <p class="text-#aaa">App信息</p>
            <h3 class="pt-32px text-24px font-bold">
              <!-- <count-to prefix="$" :start-value="0" :end-value="7754" /> -->
              {{ item.displayName }} ({{ item.name }})
            </h3>
            <p class="text-#aaa">应用名称</p>
            <p>{{ item.id }}</p>
            <h3 class="pt-32px text-24px font-bold">
              <!-- <count-to :start-value="0" :end-value="1234" /> -->
              {{ item.description }}
            </h3>
            <p class="text-#aaa">应用描述</p>
            <n-button class="mt-24px whitespace-pre-wrap" type="primary" @click="handleEditTable(item.id)">
              查看
            </n-button>
          </div>
        </n-card>
      </n-grid-item>
    </template>
    <n-grid-item span="0:24 640:24 1024:24" style="margin-bottom: 12px">
      <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" :on-done="onAppUpdated" />
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useDashStore } from '@/store';
import { useBoolean } from '@/hooks';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
// import { type ECOption, useEcharts } from '@/composables';
const { bool: visible, setTrue: openModal } = useBoolean();
defineOptions({ name: 'DashboardAnalysisTopCard' });

const appsRef: Ref<any> = ref([]);
const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

function handleCreate() {
  console.log('handle create app...');
  openModal();
  setModalType('add');
}

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

function handleEditTable(rowId: string) {
  const findItem = appsRef.value.find((item: any) => item.id === rowId);
  if (findItem) {
    setEditData({
      appName: findItem.name,
      appToken: findItem.token,
      ...findItem
    });
  }
  setModalType('edit');
  openModal();
}

async function onAppUpdated() {
  console.log('app need relaod');
  const store = useDashStore();
  const list = await store.getAppList();
  console.log('dash app reload list: ', list);
  appsRef.value = list;
}
onMounted(async () => {
  // do something with the element
  const store = useDashStore();
  const list = await store.getAppList();
  console.log('dash app list: ', list);
  appsRef.value = list;
});
</script>

<style scoped></style>
