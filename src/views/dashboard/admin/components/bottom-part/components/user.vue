<template>
  <n-card title="用户列表" :bordered="false" class="h-full rounded-16px shadow-sm">
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" class="my-1 rounded-16px shadow-sm">
      <n-grid-item span="0:24 640:10 1024:10">
        <n-date-picker
          v-model:value="range"
          type="datetimerange"
          clearable
          update-value-on-close
          :on-confirm="setQueryDate"
        />
      </n-grid-item>
      <n-grid-item span="0:24 640:14 1024:14">
        <n-input-group>
          <n-button type="primary">AppId</n-button>
          <n-input
            v-model:value="queryAppId"
            type="text"
            :style="{ width: '50%' }"
            placeholder="appId"
            clearable
            :on-clear="clearAppId"
          />
          <n-button type="primary">Name</n-button>
          <n-input v-model:value="queryName" type="text" :style="{ width: '50%' }" placeholder="name" clearable />
          <n-button type="primary" ghost :on-click="reload">Search</n-button>
        </n-input-group>
      </n-grid-item>
    </n-grid>
    <n-data-table
      size="small"
      :columns="columnsRef"
      :data="userDataRef"
      :pagination="paginationReactive"
      @update:sorter="handleUserSorterChange"
    />
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, h, ref, reactive } from 'vue';
import { NTag } from 'naive-ui';
import type { TableBaseColumn, TableColumns } from 'naive-ui/es/data-table/src/interface';
import { useDashStore } from '@/store';

defineOptions({ name: 'DashboardAnalysisBottomPart' });
const queryObj: any = {};
const queryAppId = ref(null);
const queryName = ref(null);
const range = ref<[number, number]>([new Date().valueOf() - 24 * 3600 * 1000, Date.now()]);
const dataRow: any = [];
const userDataRef = ref(dataRow as any);

const appIdColumn: TableBaseColumn = {
  title: 'AppId',
  key: 'appId',
  sortOrder: false,
  sorter: 'default'
};

const nameColumn: TableBaseColumn = {
  title: 'Name',
  key: 'name',
  sortOrder: false,
  sorter: 'default'
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
  appIdColumn as TableBaseColumn,
  nameColumn,
  {
    title: 'Email',
    key: 'email'
  },
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

const handleUserSorterChange = (sorter: any) => {
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

const setQueryDate = (resp: any) => {
  console.log('date query: ', resp);
  if (!range.value) {
    return;
  }
  const [start, end] = range.value;
  queryObj.start = start;
  queryObj.end = end;
  console.log('query obj: ', queryObj);
};

const clearAppId = () => {
  console.log('clear app id');
  queryAppId.value = null;
};

const reload = async () => {
  const store = useDashStore();
  const [start, end] = range.value || [];
  const obj: any = {
    isAdmin: true,
    start,
    end
  };
  console.log('reload data: ', queryObj, queryAppId.value);
  if (queryAppId.value) {
    obj.appId = queryAppId.value;
  }
  if (queryName.value) {
    obj.name = queryName.value;
  }
  const userList = await store.getUserList(obj);
  userDataRef.value = userList;
  console.log('reload user data: ', userDataRef);
};

onMounted(async () => {
  // do something with the element
  const store = useDashStore();
  const userList = await store.getUserList({ isAdmin: true });
  userDataRef.value.push(...userList);
  console.log('user data: ', userDataRef);
});
</script>

<style scoped></style>
