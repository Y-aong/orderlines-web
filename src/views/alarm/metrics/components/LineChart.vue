<template>
  <div class="line-chat" :id="chartId" :style="{ height: chartSize }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineProps } from "vue";
import * as echarts from "echarts";

// 定义 props 接收外部配置
const props = defineProps<{
  refreshInterval?: number;
  chartSize?: string;
  api: any;
  query: any;
}>();

// 生成唯一的图表 ID
const chartId = ref(`line-chart-${Math.random().toString(36).substr(2, 8)}`);
let chartInstance: echarts.ECharts | null = null;
let timer: NodeJS.Timeout | null = null;

// 获取最终的图表配置选项
const getFinalOption = async (data: any) => {
  const response = await props.api(data);
  return response.data;
};

// 初始化图表方法
const initChart = async () => {
  if (!chartInstance) {
    chartInstance = echarts.init(document.getElementById(chartId.value)!);
  }
  const finalOption = await getFinalOption(props.query);
  try {
    chartInstance?.setOption(finalOption);
  } catch (error) {
    console.log("异常数据", finalOption);
    console.error(error);
  }
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

// 监听 query 变化并更新图表
watch(
  () => props.query,
  async (newQuery, oldQuery) => {
    console.log("Query changed", newQuery, oldQuery);
    await getFinalOption(newQuery).then(finalOption => {
      chartInstance?.setOption(finalOption);
    });
  },
  { deep: true } // 深度监听对象内部的变化
);

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
.line-chat {
  width: 100%;
}
</style>
