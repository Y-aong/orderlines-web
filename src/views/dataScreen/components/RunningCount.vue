<template>
  <!-- 运行次数对比 -->
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";
import { AnnualDataType, RunningCountData } from "@/api/dataScreen/type";
import { ref, defineProps, watch } from "vue";
let option = ref<ECOption>({});
const props = defineProps<Props>();

interface Props {
  data: RunningCountData;
}

watch(props, () => {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none"
      },
      borderWidth: 0,
      padding: 0,
      backgroundColor: "transparent",
      formatter: (params: any) => {
        let str = "";
        params.forEach((val: { color: string; seriesName: string; data: number }) => {
          str += `
          <div class="year-item">
            <span class="year-dot" style="background-color: ${val.color};"></span>
            <span class="year-name">${val.seriesName}</span>
            <span class="year-value">${val.data >= 10000 ? (val.data / 10000).toFixed(2) + "w" : val.data}</span>
          </div>
          `;
        });
        const dom = `
                    <div class="annual-tooltip">
                      <span class="annual-month">${params[0].dataIndex + 1}月</span>
                      <div class="annual-list">
                        ${str}
                      </div>
                    </div>
                  `;
        return dom;
      }
    },
    legend: {
      right: "2%",
      top: "0%",
      itemWidth: 15,
      itemHeight: 6,
      align: "auto",
      icon: "rect",
      itemGap: 15,
      textStyle: {
        color: "#ebebf0"
      }
    },
    grid: {
      top: "20%",
      left: "40",
      right: "4%",
      bottom: "15%"
    },
    xAxis: [
      {
        name: "(月份)",
        type: "category",
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#233653"
          }
        },
        axisLabel: {
          color: "#7ec7ff",
          padding: 0,
          fontSize: 12,
          formatter: function (data) {
            return data;
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#192a44"
          }
        },
        axisTick: {
          show: false
        },
        data: props.data.columns
      }
    ],
    yAxis: {
      name: "(运行总量)",
      nameTextStyle: {
        color: "#D6DFEA",
        fontSize: 12,
        padding: [0, 30, 0, 0]
      },
      minInterval: 1,
      splitNumber: 5,
      splitLine: {
        show: false,
        lineStyle: {
          color: "#192a44"
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#233653"
        }
      },
      axisLabel: {
        show: true,
        color: "#B9D6D6",
        padding: 0
      },
      axisTick: {
        show: false
      }
    },
    series: props.data.data.map((val: AnnualDataType, index: number) => {
      return {
        name: val.label,
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: props.data.colors[index],
          borderColor: props.data.colors[index]
        },
        itemStyle: {
          color: props.data.colors[index],
          borderColor: "#646ace",
          borderWidth: 2
        },
        tooltip: {
          show: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: props.data.colors[index]
              },
              {
                offset: 1,
                color: gradientColors[index]
              }
            ],
            global: false
          },
          shadowColor: "rgba(25,163,223, 0.3)",
          shadowBlur: 20
        },
        data: val.value
      };
    })
  };
});

const gradientColors = ["rgba(254, 219, 101,0.1)", "rgba(0, 122, 254,0.1)", "rgba(255, 75, 122, 0.1)"];
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
:deep(.annual-tooltip) {
  box-sizing: border-box;
  width: 206px;
  height: 103px;
  padding: 5px 20px;
  background: url("../images/contrast-bg.png") no-repeat;
  background-size: 100% 100%;
  .annual-month {
    display: inline-block;
    margin-bottom: 2px;
    font-size: 10px;
    color: #03b8e2;
    transform: scale(0.9);
  }
  .annual-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    .year-item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 22px;
      .year-dot {
        width: 5px;
        height: 5px;
        margin: 0 2px;
        border-radius: 50%;
      }
      .year-name,
      .year-value {
        font-size: 10px;
        color: #03b8e2;
        transform: scale(0.8);
      }
      .year-name {
        margin: 0 2px;
      }
      .year-value {
        display: inline-block;
        width: 25%;
      }
    }
  }
}
</style>
