<template>
  <n-card title="订单列表" :bordered="false" class="h-full rounded-16px shadow-sm">
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" class="my-1 rounded-16px shadow-sm">
      <n-grid-item span="0:24 640:10 1024:10">
        <n-date-picker v-model:value="range" type="datetimerange" clearable update-value-on-close />
      </n-grid-item>
      <n-grid-item span="0:24 640:14 1024:14">
        <n-input-group>
          <n-button type="primary">Serial</n-button>
          <n-input-number
            v-model:value="querySerial"
            :style="{ width: '50%' }"
            placeholder="Serial"
            clearable
            :on-clear="clearSerial"
          />
          <n-button type="primary">Status</n-button>
          <n-input v-model:value="queryStatus" type="text" :style="{ width: '50%' }" placeholder="Status" clearable />
          <n-button type="primary" ghost :on-click="reload">Search</n-button>
        </n-input-group>
      </n-grid-item>
    </n-grid>
    <n-data-table
      size="small"
      :columns="columnsRef"
      :data="orderDataRef"
      :pagination="paginationReactive"
      @update:sorter="handleSorterChange"
    />
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, h, ref, reactive } from 'vue';
import { NTag } from 'naive-ui';
import type { TableBaseColumn, TableColumns } from 'naive-ui/es/data-table/src/interface';
import { useDashStore } from '@/store';

defineOptions({ name: 'DashboardAnalysisBottomPart' });
const querySerial = ref(0);
const queryStatus = ref(null);
const range = ref<[number, number]>([new Date().valueOf() - 24 * 3600 * 1000, Date.now()]);

const orderDataRef = ref([] as any);

const statusColumn: TableBaseColumn = {
  title: 'Status',
  key: 'status',
  sortOrder: false,
  sorter: 'default'
};

const serialColumn: TableBaseColumn = {
  title: 'Serial',
  key: 'serial',
  sortOrder: false,
  sorter: 'default'
};

const customerNameColumn: TableBaseColumn = {
  title: 'CustomerName',
  key: 'customer',
  sortOrder: false,
  sorter: 'default',
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
};

const createdAtColumn: TableBaseColumn = {
  title: 'Created',
  key: 'createdAt',
  sortOrder: false,
  sorter(rowA: any, rowB: any): number {
    return new Date(rowA.createdAt).valueOf() - new Date(rowB.createdAt).valueOf();
  },
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
        default: () => new Date(row.createdAt).toLocaleString()
      }
    );
  }
};

const updatedAtColumn: TableBaseColumn = {
  title: 'Updated',
  key: 'updatedAt',
  sortOrder: false,
  sorter(rowA: any, rowB: any): number {
    return new Date(rowA.updatedAt).valueOf() - new Date(rowB.updatedAt).valueOf();
  },
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
        default: () => new Date(row.updatedAt).toLocaleString()
      }
    );
  }
};

const columns: TableColumns = [
  {
    title: 'id',
    key: 'id'
  },
  serialColumn,
  statusColumn,
  {
    title: 'CustomerId',
    key: 'customerId'
  },
  customerNameColumn,
  createdAtColumn,
  updatedAtColumn
];

// const nameColumnReactive = reactive(nameColumn);
// const appIdColumnReactive = reactive(appIdColumn);
const columnsRef = ref(columns);
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    paginationReactive.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize;
    paginationReactive.page = 1;
  }
});

const handleSorterChange = (sorter: any) => {
  columnsRef.value.forEach((column: any) => {
    /** column.sortOrder !== undefined means it is uncontrolled */
    if (column.sortOrder === undefined) return;
    if (!sorter) {
      column.sortOrder = false;
      return;
    }
    if (column.key === sorter.columnKey) column.sortOrder = sorter.order;
    else column.sortOrder = false;
  });
};

const clearSerial = () => {
  console.log('clear serial');
  querySerial.value = 0;
};

const reload = async () => {
  const store = useDashStore();
  const [start, end] = range.value || [];
  const obj: any = {
    isAdmin: true,
    start,
    end
  };
  console.log('reload data: ', querySerial.value);
  if (querySerial.value) {
    obj.serial = querySerial.value;
  }
  if (queryStatus.value) {
    obj.status = queryStatus.value;
  }
  const userList = await store.getOrderList(obj);
  orderDataRef.value = userList;
  console.log('reload user data: ', orderDataRef);
};

onMounted(async () => {
  // do something with the element
  const store = useDashStore();
  const orderList: any[] = await store.getOrderList({ isAdmin: true });
  orderDataRef.value.push(...(orderList || []));
  console.log('order data: ', orderDataRef);
});
</script>

<style scoped></style>
