<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <!-- <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="时间线" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-timeline>
          <n-timeline-item v-for="item in timelines" :key="item.type" v-bind="item" />
        </n-timeline>
      </n-card>
    </n-grid-item> -->
    <n-grid-item span="0:24 640:24 1024:24">
      <user-table></user-table>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:24">
      <order-table></order-table>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
// import { onMounted, h, ref } from 'vue';
// import { useDashStore } from '@/store';
import { UserTable, OrderTable } from './components';

defineOptions({ name: 'DashboardAnalysisBottomPart' });

// onMounted(async () => {
//   // do something with the element
//   const store = useDashStore();
//   const list = await store.getAppList();
//   console.log('app list: ', list);
// });
</script>

<style scoped></style>
