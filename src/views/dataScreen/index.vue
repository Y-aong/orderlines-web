<template>
  <div class="dataScreen-container">
    <div class="dataScreen-content" ref="dataScreenRef">
      <div class="dataScreen-header">
        <div class="header-lf">
          <span class="header-screening" @click="router.push(HOME_URL)">首页</span>
        </div>
        <div class="header-ct">
          <div class="header-ct-title">
            <span>ORDERLINES数据大屏展示</span>
            <div class="header-ct-warning">流程告警信息</div>
          </div>
        </div>
        <div class="header-ri">
          <span class="header-download">统计报告</span>
          <span class="header-time">当前时间：{{ time }}</span>
        </div>
      </div>
      <div class="dataScreen-main">
        <div class="dataScreen-lf">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span>实时运行任务</span>
            </div>
            <div class="dataScreen-main-chart">
              <RealTimeAccessChart />
            </div>
          </div>
          <div class="dataScreen-center">
            <div class="dataScreen-main-title">
              <span>启动方式比例</span>
            </div>
            <div class="dataScreen-main-chart">
              <MaleFemaleRatioChart />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>流程状态统计</span>
            </div>
            <div class="dataScreen-main-chart">
              <AgeRatioChart />
            </div>
          </div>
        </div>
        <div class="dataScreen-ct">
          <div class="dataScreen-map">
            <div class="dataScreen-map-title"></div>
          </div>
          <div class="dataScreen-cb">
            <div class="dataScreen-main-title">
              <span>流程运次数趋势图</span>
            </div>
            <div class="dataScreen-main-chart">
              <OverNext30Chart />
            </div>
          </div>
        </div>
        <div class="dataScreen-rg">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span>流程运行数量排行</span>
              <!-- <img src="./images/dataScreen-title.png" alt="" /> -->
            </div>
            <div class="dataScreen-main-chart">
              <HotPlateChart />
            </div>
          </div>
          <div class="dataScreen-center">
            <div class="dataScreen-main-title">
              <span>运行次数对比</span>
            </div>
            <div class="dataScreen-main-chart">
              <AnnualUseChart />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>插件使用统计</span>
            </div>
            <div class="dataScreen-main-chart">
              <PlatformSourceChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataScreen">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";
import AgeRatioChart from "./components/AgeRatioChart.vue";
import AnnualUseChart from "./components/AnnualUseChart.vue";
// import ChinaMapChart from "./components/ChinaMapChart.vue";
import HotPlateChart from "./components/HotPlateChart.vue";
import MaleFemaleRatioChart from "./components/MaleFemaleRatioChart.vue";
import OverNext30Chart from "./components/OverNext30Chart.vue";
import PlatformSourceChart from "./components/PlatformSourceChart.vue";
import RealTimeAccessChart from "./components/RealTimeAccessChart.vue";
import dayjs from "dayjs";

const router = useRouter();
const dataScreenRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    dataScreenRef.value.style.width = `1920px`;
    dataScreenRef.value.style.height = `1080px`;
  }
  window.addEventListener("resize", resize);
});

// 设置响应式
const resize = () => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
  }
};

// 根据浏览器大小推断缩放比例
const getScale = (width = 1920, height = 1080) => {
  let ww = window.innerWidth / width;
  let wh = window.innerHeight / height;
  return ww < wh ? ww : wh;
};

// 获取当前时间
let timer: NodeJS.Timer | null = null;
let time = ref<string>(dayjs().format("YYYY年MM月DD HH:mm:ss"));
timer = setInterval(() => {
  time.value = dayjs().format("YYYY年MM月DD HH:mm:ss");
}, 1000);

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  clearInterval(timer!);
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
