<template>
  <div :id="chartId" :style="{ width: chartSize, height: chartSize }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineProps } from "vue";
import * as echarts from "echarts";

// 定义 props 接收外部配置
const props = defineProps<{
  refreshInterval?: number;
  chartSize?: string;
  api?: any;
}>();

// 生成唯一的图表 ID
const chartId = ref(`pie-chart-${Math.random().toString(36).substr(2, 8)}`);
let chartInstance: echarts.ECharts | null = null;
let timer: NodeJS.Timeout | null = null;
// 合并 series 的辅助函数
const mergeSeries = (defaultSeries: any[], customSeries?: any[]): any[] => {
  if (!customSeries || customSeries.length === 0) {
    return defaultSeries;
  }

  // 深拷贝默认 series
  const mergedSeries = JSON.parse(JSON.stringify(defaultSeries));

  // 遍历自定义 series 并与默认 series 合并
  for (let i = 0; i < Math.max(defaultSeries.length, customSeries.length); i++) {
    if (customSeries[i]) {
      mergedSeries[i] = { ...mergedSeries[i], ...customSeries[i] };
    }
  }

  return mergedSeries;
}; // 初始化图表方法
const initChart = async () => {
  if (!chartInstance) {
    chartInstance = echarts.init(document.getElementById(chartId.value)!);
  }
  // 默认配置项与用户提供的配置合并
  const defaultOption = {
    color: ["#5cb85c", "#fca106"],

    tooltip: {
      trigger: "item"
    },
    series: [
      {
        type: "pie",
        avoidLabelOverlap: true,
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: "bold"
          }
        },

        itemStyle: {
          borderRadius: 3,
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        radius: ["40%", "70%"]
      }
    ]
  };
  const getFinalOption = async () => {
    const response = await props.api();
    return response.data;
  };
  const apiOption = await getFinalOption();

  const finalOption = {
    ...defaultOption,
    ...(defaultOption || {}),
    series: mergeSeries(defaultOption.series, apiOption?.series),
    title: apiOption?.title
  };

  chartInstance.setOption(finalOption);
};

// 设置定时器以定期更新图表数据
const setTimer = () => {
  clearInterval(timer!);
  if (props.refreshInterval && !timer) {
    timer = setInterval(initChart, props.refreshInterval * 1000);
  }
};

// 监听属性变化
watch(() => props.refreshInterval, setTimer);

// 组件挂载时初始化图表并设置定时器
onMounted(() => {
  initChart();
  setTimer();
});

// 组件卸载时清除定时器并销毁图表实例
onUnmounted(() => {
  clearInterval(timer!);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
/* 样式可以根据需要调整 */
</style>
