<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <template v-for="item in appsRef" :key="item.id">
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
            <n-button class="mt-24px whitespace-pre-wrap" type="primary">详细信息(TBD)</n-button>
          </div>
        </n-card>
      </n-grid-item>
    </template>

    <!-- <n-grid-item span="0:24 640:24 1024:10">
      <n-card :bordered="false" class="rounded-16px shadow-sm">
        <div ref="lineRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card :bordered="false" class="rounded-16px shadow-sm">
        <div ref="pieRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item> -->
  </n-grid>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useDashStore } from '@/store';
// import { type ECOption, useEcharts } from '@/composables';

defineOptions({ name: 'DashboardAnalysisTopCard' });

// const lineOptions = ref<ECOption>({
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross',
//       label: {
//         backgroundColor: '#6a7985'
//       }
//     }
//   },
//   legend: {
//     data: ['下载量', '注册数']
//   },
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   xAxis: [
//     {
//       type: 'category',
//       boundaryGap: false,
//       data: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
//     }
//   ],
//   yAxis: [
//     {
//       type: 'value'
//     }
//   ],
//   series: [
//     {
//       color: '#8e9dff',
//       name: '下载量',
//       type: 'line',
//       smooth: true,
//       stack: 'Total',
//       areaStyle: {
//         color: {
//           type: 'linear',
//           x: 0,
//           y: 0,
//           x2: 0,
//           y2: 1,
//           colorStops: [
//             {
//               offset: 0.25,
//               color: '#8e9dff'
//             },
//             {
//               offset: 1,
//               color: '#fff'
//             }
//           ]
//         }
//       },
//       emphasis: {
//         focus: 'series'
//       },
//       data: [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311]
//     },
//     {
//       color: '#26deca',
//       name: '注册数',
//       type: 'line',
//       smooth: true,
//       stack: 'Total',
//       areaStyle: {
//         color: {
//           type: 'linear',
//           x: 0,
//           y: 0,
//           x2: 0,
//           y2: 1,
//           colorStops: [
//             {
//               offset: 0.25,
//               color: '#26deca'
//             },
//             {
//               offset: 1,
//               color: '#fff'
//             }
//           ]
//         }
//       },
//       emphasis: {
//         focus: 'series'
//       },
//       data: [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678]
//     }
//   ]
// }) as Ref<ECOption>;
// const { domRef: lineRef } = useEcharts(lineOptions);

// const pieOptions = ref<ECOption>({
//   tooltip: {
//     trigger: 'item'
//   },
//   legend: {
//     bottom: '1%',
//     left: 'center',
//     itemStyle: {
//       borderWidth: 0
//     }
//   },
//   series: [
//     {
//       color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
//       name: '时间安排',
//       type: 'pie',
//       radius: ['45%', '75%'],
//       avoidLabelOverlap: false,
//       itemStyle: {
//         borderRadius: 10,
//         borderColor: '#fff',
//         borderWidth: 1
//       },
//       label: {
//         show: false,
//         position: 'center'
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: '12'
//         }
//       },
//       labelLine: {
//         show: false
//       },
//       data: [
//         { value: 20, name: '学习' },
//         { value: 10, name: '娱乐' },
//         { value: 30, name: '工作' },
//         { value: 40, name: '休息' }
//       ]
//     }
//   ]
// }) as Ref<ECOption>;
// const { domRef: pieRef } = useEcharts(pieOptions);

const appsRef: Ref<any> = ref([]);

onMounted(async () => {
  // do something with the element
  const store = useDashStore();
  const list = await store.getAppList({ isAdmin: true });
  console.log('dash app list: ', list);
  appsRef.value.push(...list);
});
</script>

<style scoped></style>
