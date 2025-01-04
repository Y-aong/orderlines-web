<template>
  <div :id="chartId" :style="{ width: chartSize, height: chartSize }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from "vue";
import * as echarts from "echarts";

// 定义 props 接收外部配置
const props = defineProps<{
  refreshInterval?: number;
  chartSize?: string;
  api?: any;
}>();

// 生成唯一的图表 ID
const chartId = ref(`gauge-chart-${Math.random().toString(36).substr(2, 8)}`);
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
};

// 初始化图表方法
const initChart = async () => {
  if (!chartInstance) {
    chartInstance = echarts.init(document.getElementById(chartId.value)!);
  }
  const getApiOption = async () => {
    const response = await props.api();
    return response.data;
  };
  const apiOption = await getApiOption();

  // 使用传入的option或默认option
  const finalOption = {
    ...defaultOption,
    ...(apiOption || {}),
    series: mergeSeries(defaultOption.series, apiOption?.series)
  };

  chartInstance.setOption(finalOption);
};

// 默认配置项
const defaultOption = {
  series: [
    {
      type: "gauge",
      progress: {
        show: true,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 1,
          color: "#5cb85c"
        }
      },
      startAngle: 90,
      endAngle: -270,

      title: {
        offsetCenter: [0, "-15%"], // 调整标题位置
        fontSize: 14,
        color: "#000"
      },
      detail: {
        formatter: "{value}%",
        fontSize: 12,
        color: "#000",
        offsetCenter: [0, "30%"]
      },
      pointer: {
        show: false
      },
      axisLabel: {
        show: false // 隐藏刻度标签
      },
      axisTick: {
        show: false // 刻度线
      },
      splitLine: {
        show: false // 分割线
      },
      axisLine: {
        lineStyle: {
          width: 20 // 刻度线宽度
        }
      }
    }
  ]
};

// 设置定时器以定期更新图表数据
const setTimer = () => {
  clearInterval(timer!);
  if (props.refreshInterval && !timer) {
    timer = setInterval(initChart, props.refreshInterval * 1000);
  }
};

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
