<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <!-- <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="时间线" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-timeline>
          <n-timeline-item v-for="item in timelines" :key="item.type" v-bind="item" />
        </n-timeline>
      </n-card>
    </n-grid-item> -->
    <n-grid-item v-my-directive span="0:24 640:24 1024:24">
      <n-card title="表格" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-data-table size="small" :columns="columns" :data="userData" />
      </n-card>
    </n-grid-item>
    <n-grid-item v-my-directive span="0:24 640:24 1024:24">
      <n-card title="表格" :bordered="false" class="h-full rounded-16px shadow-sm">
        <n-data-table size="small" :columns="orderColumns" :data="orderData" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { onMounted, h, ref } from 'vue';
import { NTag } from 'naive-ui';
import { useDashStore } from '@/store';

defineOptions({ name: 'DashboardAnalysisBottomPart' });

interface TableData {
  // key: number;
  // name: string;
  // age: number;
  // address: string;
  // tags: string[];

  id: string;
  createdAt: string;
  updatedAt: string;
  appId: string;
  name: string;
  email: string;
}

const userData = ref([] as any);

const columns = [
  {
    title: 'id',
    key: 'id'
  },
  {
    title: 'AppId',
    key: 'appId'
  },
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Email',
    key: 'email'
  },
  {
    title: 'Created',
    key: 'createdAt',
    render(row: TableData) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info'
        },
        {
          default: () => new Date(row.createdAt).toLocaleString()
        }
      );
    }
  },
  {
    title: 'Updated',
    key: 'updatedAt',
    render(row: TableData) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info'
        },
        {
          default: () => new Date(row.updatedAt).toLocaleString()
        }
      );
    }
  }
];

const orderData = ref([] as any);

const orderColumns = [
  {
    title: 'id',
    key: 'id'
  },
  {
    title: 'Serial',
    key: 'serial'
  },
  {
    title: 'Status',
    key: 'status'
  },
  {
    title: 'CustomerId',
    key: 'customerId'
  },
  {
    title: 'CustomerName',
    key: 'customer',
    render(row: any) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info'
        },
        {
          default: () => row.customer.name
        }
      );
    }
  },
  {
    title: 'Created',
    key: 'createdAt',
    render(row: TableData) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info'
        },
        {
          default: () => new Date(row.createdAt).toLocaleString()
        }
      );
    }
  },
  {
    title: 'Updated',
    key: 'updatedAt',
    render(row: TableData) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info'
        },
        {
          default: () => new Date(row.updatedAt).toLocaleString()
        }
      );
    }
  }
];

onMounted(async () => {
  // do something with the element
  const store = useDashStore();
  const list = await store.getAppList();
  console.log('app list: ', list);
  const userList = await store.getUserList();
  userData.value.push(...userList);
  console.log('user data: ', userData);

  const orderList: any[] = await store.getOrderList();
  orderData.value.push(...(orderList || []));
  console.log('order data: ', orderData);
});
</script>

<style scoped></style>
