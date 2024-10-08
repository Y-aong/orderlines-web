<template>
  <!-- 流程状态 -->
  <div class="echarts">
    <ECharts :option="option" :resize="false" />
  </div>
</template>

<script setup lang="ts">
import ECharts from "@/components/ECharts/index.vue";
import { ECOption } from "@/components/ECharts/config";
import { ref, defineProps, watch } from "vue";

let option = ref<ECOption>({});

const props = defineProps<Props>();
const colors = ["#F6C95C", "#EF7D33", "#1F9393", "#184EA1", "#81C8EF", "#9270CA"];

interface Props {
  data: any[];
}

watch(props, () => {
  option.value = {
    color: colors,
    tooltip: {
      show: true,
      trigger: "item",
      formatter: "{b} <br/>占比：{d}%"
    },
    legend: {
      orient: "vertical",
      right: "20px",
      top: "15px",
      itemGap: 15,
      itemWidth: 14,
      formatter: function (name: string) {
        let text = "";
        props.data.forEach((val: any) => {
          if (val.name === name) text = " " + name + "　 " + val.value;
        });
        return text;
      },
      textStyle: { color: "#fff" }
    },
    grid: { top: "bottom", left: 10, bottom: 10 },
    series: [
      {
        zlevel: 1,
        name: "任务状态",
        type: "pie",
        selectedMode: "single",
        radius: [50, 90],
        center: ["35%", "50%"],
        startAngle: 60,
        label: {
          position: "inside",
          show: true,
          color: "#fff",
          formatter: function (params) {
            return (params.data as any).percentage;
          },
          rich: {
            b: {
              fontSize: 16,
              lineHeight: 30,
              color: "#fff"
            }
          }
        },
        itemStyle: {
          shadowColor: "rgba(0, 0, 0, 0.2)",
          shadowBlur: 10
        },
        data: props.data.map((val: any, index: number) => {
          return {
            value: val.value,
            name: val.name,
            percentage: val.percentage,
            itemStyle: {
              borderWidth: 10,
              shadowBlur: 20,
              borderColor: colors[index],
              borderRadius: 10
            }
          };
        })
      },
      {
        name: "",
        type: "pie",
        selectedMode: "single",
        radius: [50, 90],
        center: ["35%", "50%"],
        startAngle: 60,
        data: [
          {
            value: 1000,
            name: "",
            label: {
              show: true,
              formatter: "{a|流程状态}",
              rich: {
                a: {
                  align: "center",
                  color: "rgb(98,137,169)",
                  fontSize: 14
                }
              },
              position: "center"
            }
          }
        ]
      }
    ]
  };
});
</script>
<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
