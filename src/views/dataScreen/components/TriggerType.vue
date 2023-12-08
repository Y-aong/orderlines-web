<template>
  <!-- 启动比例 -->
  <div class="ratio-main">
    <div class="ratio-header">
      <div class="man">
        <span>手动启动</span>
        <img src="../images/trigger.svg" alt="" />
      </div>
      <div class="woman">
        <span>定时启动</span>
        <img src="../images/schedule.svg" alt="" />
      </div>
    </div>
    <!-- echarts -->
    <div class="echarts">
      <ECharts :option="option" :resize="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";

import { ref, defineProps, watch } from "vue";
import { TriggerType } from "@/api/data_screen/type";

let option = ref<ECOption>({});
interface Props {
  data: TriggerType;
}

const props = defineProps<Props>();

watch(props, () => {
  option.value = {
    xAxis: {
      type: "value",
      show: false
    },
    grid: {
      left: 0,
      top: "30px",
      bottom: 0,
      right: 0
    },
    yAxis: [
      {
        type: "category",
        position: "left",
        data: ["手动启动"],
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      },
      {
        type: "category",
        position: "right",
        data: ["定时启动"],
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false,
          padding: [0, 0, 40, -60],
          fontSize: 12,
          lineHeight: 60,
          color: "rgba(255, 255, 255, 0.9)",
          formatter: "{value}" + props.data.schedule + "%",
          rich: {
            a: {
              color: "transparent",
              lineHeight: 30,
              fontFamily: "digital",
              fontSize: 12
            }
          }
        }
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: 20,
        data: [props.data.trigger],
        z: 20,
        itemStyle: {
          borderRadius: 10,
          color: "#007AFE"
        },
        label: {
          show: true,
          color: "#E7E8ED",
          position: "insideLeft",
          offset: [0, -20],
          fontSize: 12,
          formatter: () => {
            if (props.data.trigger == 1) {
              return "手动启动" + 100 + "%";
            } else if (props.data.trigger == 1) {
              return "手动启动" + 0 + "%";
            } else {
              let item = props.data.trigger.toString().split(".")[1];
              let value = item === undefined ? "0" : item;
              return "手动启动" + value + "%";
            }
          }
        }
      },
      {
        type: "bar",
        barWidth: 20,
        data: [1],
        barGap: "-100%",
        itemStyle: {
          borderRadius: 10,
          color: "#FF4B7A"
        },
        label: {
          show: true,
          color: "#E7E8ED",
          position: "insideRight",
          offset: [0, -20],
          fontSize: 12,
          formatter: () => {
            if (props.data.schedule == 1) {
              return "定时启动" + 100 + "%";
            } else if (props.data.schedule == 1) {
              return "定时启动" + 0 + "%";
            } else {
              let item = props.data.schedule.toString().split(".")[1];
              let value = item === undefined ? "0" : item;
              return "定时启动" + value + "%";
            }
          }
        }
      }
    ]
  };
});
</script>
<style lang="scss" scoped>
.ratio-main {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 40px 65px;
  .ratio-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 115px;
    .man,
    .woman {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 110px;
      height: 115px;
      background: url("../images/man-bg.png") no-repeat;
      background-size: 100% 100%;
      img {
        width: 60px;
        height: 60px;
        margin-top: 20px;
      }
      span {
        margin-top: 2px;
        font-size: 13px;
        color: #ffffff;
      }
    }
    .woman {
      background: url("../images/woman-bg.png") no-repeat;
    }
  }
  .echarts {
    width: 100%;
    height: calc(100% - 115px);
  }
}
</style>
