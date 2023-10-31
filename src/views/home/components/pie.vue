<template>
  <div class="echarts">
    <ECharts :option="option" />
  </div>
</template>

<script setup lang="ts" name="pie">
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { getRunStatus } from "@/api/home/index";
import { ref, onMounted, defineProps } from "vue";

const props = defineProps();

let pieData = ref([
  { value: 0, name: "运行成功" },
  { value: 0, name: "运行失败" },
  { value: 0, name: "运行停止" },
  { value: 0, name: "运行超时" }
]);

onMounted(async () => {
  const res: any = await getRunStatus();
  if (res.code === 200) {
    pieData.value = res.data;
    console.log(pieData);
  }
});

const option: ECOption = {
  title: {
    text: "运行状态",
    subtext: "",
    left: "56%",
    top: "45%",
    textAlign: "center",
    textStyle: {
      fontSize: 18,
      color: "#767676"
    },
    subtextStyle: {
      fontSize: 12,
      color: "#a1a1a1"
    }
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    top: "4%",
    left: "2%",
    orient: "vertical",
    icon: "circle", //图例形状
    align: "left",
    itemGap: 20,
    textStyle: {
      fontSize: 14,
      color: "#a1a1a1",
      fontWeight: 400
    },
    formatter: function (name: string) {
      let dataCopy = "";
      for (let i = 0; i < pieData.value.length; i++) {
        if (pieData.value[i].name == name && pieData.value[i].value >= 10000) {
          dataCopy = (pieData.value[i].value / 10000).toFixed(2);
          return name + "      " + dataCopy + "w";
        } else if (pieData.value[i].name == name) {
          dataCopy = pieData.value[i].value + "";
          return name + "      " + dataCopy;
        }
      }
      return "";
    }
  },
  series: [
    {
      type: "pie",
      radius: ["70%", "40%"],
      center: ["57%", "52%"],
      silent: true,
      clockwise: true,
      startAngle: 150,
      data: pieData.value,
      labelLine: {
        length: 65,
        length2: 30,
        lineStyle: {
          width: 1
        }
      },
      label: {
        position: "outside",
        show: true,
        formatter: "{d}%",
        fontWeight: 400,
        fontSize: 16,
        color: "#a1a1a1"
      },
      color: [
        {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0.5,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#feb791" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#fe8b4c" // 100% 处的颜色
            }
          ]
        },
        {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 0.5,
          colorStops: [
            {
              offset: 0,
              color: "#b898fd" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#8347fd" // 100% 处的颜色
            }
          ]
        }
      ]
    }
  ]
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
