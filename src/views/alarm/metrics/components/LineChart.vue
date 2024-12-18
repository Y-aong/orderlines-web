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
  option?: Record<string, any>;
}>();

// 生成唯一的图表 ID
const chartId = ref(`line-chart-${Math.random().toString(36).substr(2, 8)}`);
let chartInstance: echarts.ECharts | null = null;
let timer: NodeJS.Timeout | null = null;

// 初始化图表方法
const initChart = () => {
  if (!chartInstance) {
    chartInstance = echarts.init(document.getElementById(chartId.value)!);
  }
  // 默认配置项与用户提供的配置合并
  const defaultOption = {
    title: { text: "折线图示例", textStyle: { frontSize: 8 } },
    grid: {
      left: "3%",
      right: "2%",
      bottom: "3%",
      top: "14%",
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    yAxis: { type: "value" },
    series: [{ name: "销量", type: "line", data: [120, 200, 150, 80, 70, 110, 130] }]
  };
  const finalOption = { ...defaultOption, ...(props.option || {}) };
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
.line-chat {
  width: 100%;
}
</style>
