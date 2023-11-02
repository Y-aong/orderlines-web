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
            <div class="header-ct-warning">流程运行信息</div>
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
              <span>系统基本信息</span>
            </div>
            <div class="dataScreen-main-chart">
              <BaseInfo :data="BaseInfoData" />
            </div>
          </div>
          <div class="dataScreen-center">
            <div class="dataScreen-main-title">
              <span>启动方式比例</span>
            </div>
            <div class="dataScreen-main-chart">
              <StartType />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>流程状态统计</span>
            </div>
            <div class="dataScreen-main-chart">
              <RunningStatus />
            </div>
          </div>
        </div>
        <div class="dataScreen-ct">
          <div class="dataScreen-map">
            <div class="dataScreen-map-title"></div>
            <RunningLog />
          </div>
          <div class="dataScreen-cb">
            <div class="dataScreen-main-title">
              <span>流程运行次数趋势图</span>
            </div>
            <div class="dataScreen-main-chart">
              <RunningTrend />
            </div>
          </div>
        </div>
        <div class="dataScreen-rg">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span>流程告警数量黑榜</span>
            </div>
            <div class="dataScreen-main-chart">
              <ProcessAlarm />
            </div>
          </div>
          <div class="dataScreen-center">
            <div class="dataScreen-main-title">
              <span>流程运行次数对比</span>
            </div>
            <div class="dataScreen-main-chart">
              <RunningCount />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>插件使用统计</span>
            </div>
            <div class="dataScreen-main-chart">
              <PluginStatus :data="plugin" />
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
import RunningStatus from "./components/RunningStatus.vue";
import RunningCount from "./components/RunningCount.vue";
import RunningLog from "./components/RunningLog.vue";
import ProcessAlarm from "./components/ProcessAlarm.vue";
import StartType from "./components/StartType.vue";
import RunningTrend from "./components/RunningTrend.vue";
import PluginStatus from "./components/PluginStatus.vue";
import BaseInfo from "./components/BaseInfo.vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import {
  getBaseInfoRequest,
  getPluginInfoRequest,
  getProcessAlarmRequest,
  getProcessStatusRequest,
  getRunningCountRequest,
  getRunningTrendRequest,
  getTriggerTypeRequest
} from "@/api/data_screen/index";
import { BaseInfoType, PluginStatusType } from "@/api/data_screen/type";

const router = useRouter();
const dataScreenRef = ref<HTMLElement | null>(null);

const plugin = ref<PluginStatusType[]>([]);
const Alarm = ref([]);
const ProcessStatus = ref([]);
const RunningCountData = ref([]);
const RunningTrendData = ref([]);
const BaseInfoData = ref<BaseInfoType>({
  alarm_count: 0,
  free_space_mb: "",
  process_failure_total: 0,
  process_run_total: 0,
  process_success_total: 0,
  process_total: 0,
  safe_run_day: 0
});

onMounted(async () => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    dataScreenRef.value.style.width = `1920px`;
    dataScreenRef.value.style.height = `1080px`;
  }
  window.addEventListener("resize", resize);
  await getPluginInfo();
  await getAlarmData();
  await getProcessStatus();
  await getRunningCount();
  await getRunningTrend();
  await getBaseInfo();
  await getTriggerType();
});

const getTriggerType = async () => {
  const res: any = await getTriggerTypeRequest();
  if (res.code == 200) {
    BaseInfo.value = res.data;
  } else {
    ElMessage.error("流程运行趋势获取异常");
  }
};

const getBaseInfo = async () => {
  const res: any = await getBaseInfoRequest();
  if (res.code == 200) {
    BaseInfoData.value = res.data;
  } else {
    ElMessage.error("流程运行趋势获取异常");
  }
};

const getRunningTrend = async () => {
  const res: any = await getRunningTrendRequest();
  if (res.code == 200) {
    RunningTrendData.value = res.data;
  } else {
    ElMessage.error("流程运行趋势获取异常");
  }
};

const getRunningCount = async () => {
  const res: any = await getRunningCountRequest();
  if (res.code == 200) {
    RunningCountData.value = res.data;
  } else {
    ElMessage.error("流程状态信息获取异常");
  }
};

const getProcessStatus = async () => {
  const res: any = await getProcessStatusRequest();
  if (res.code == 200) {
    ProcessStatus.value = res.data;
  } else {
    ElMessage.error("流程状态信息获取异常");
  }
};

const getPluginInfo = async () => {
  const pluginRes: any = await getPluginInfoRequest();
  if (pluginRes.code == 200) {
    plugin.value = pluginRes.data;
  } else {
    ElMessage.error("插件信息获取异常");
  }
};

const getAlarmData = async () => {
  const alarmRes: any = await getProcessAlarmRequest();
  if (alarmRes.code == 200) {
    Alarm.value = alarmRes.data;
  } else {
    ElMessage.error("告警信息获取异常");
  }
};

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
