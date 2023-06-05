<template>
  <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
    <n-grid-item v-for="item in cardData" :key="item.id">
      <gradient-bg class="h-100px" :start-color="item.colors[0]" :end-color="item.colors[1]">
        <h3 class="text-16px">{{ item.title }}</h3>
        <div class="flex justify-between pt-12px">
          <svg-icon :icon="item.icon" class="text-32px" />
          <count-to
            :suffix="item.unit"
            :start-value="1"
            :end-value="item.value"
            class="text-20px text-white dark:text-dark"
          />
        </div>
      </gradient-bg>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useDashStore } from '@/store';
import { GradientBg } from './components';

defineOptions({ name: 'DashboardAnalysisDataCard' });

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

const cardData: Ref<CardData[]> = ref([]);
const cardDataGen = (data: any): CardData[] => {
  console.log('data ', data);
  const { order, customer } = data;
  return [
    {
      id: 'customer-1d',
      title: '新增用户（24h)',
      value: customer.day,
      unit: '人',
      colors: ['#ec4786', '#b955a4'],
      icon: 'ant-design:bar-chart-outlined'
    },
    {
      id: 'customer-7d',
      title: '新增用户（一周)',
      value: customer.week,
      unit: '人',
      colors: ['#865ec0', '#5144b4'],
      icon: 'ant-design:bar-chart-outlined'
    },
    {
      id: 'order-1d',
      title: '订单（24h)',
      value: order.day,
      unit: '笔',
      colors: ['#56cdf3', '#719de3'],
      icon: 'ant-design:money-collect-outlined'
    },
    {
      id: 'order-7d',
      title: '订单（一周)',
      value: order.week,
      unit: '笔',
      colors: ['#fcbc25', '#f68057'],
      icon: 'ant-design:money-collect-outlined'
    }
  ];
};

onMounted(async () => {
  // do something with the element
  const store = useDashStore();
  const resp = await store.getDashStatistics();
  console.log('dash stats resp: ', resp);
  cardData.value = cardDataGen(resp);
});
</script>

<style scoped></style>
