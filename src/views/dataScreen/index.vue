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
          <span class="header-download" @click="toProcessInstance">流程实例</span>
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
              <Trigger :data="triggerData" />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>流程状态统计</span>
            </div>
            <div class="dataScreen-main-chart">
              <ProcessStatus :data="ProcessStatusData" />
            </div>
          </div>
        </div>
        <div class="dataScreen-ct">
          <div class="dataScreen-map">
            <div class="dataScreen-map-title"></div>
            <RunningLog :data="runningInfo" />
          </div>
          <div class="dataScreen-cb">
            <div class="dataScreen-main-title">
              <span>流程运行次数趋势图</span>
            </div>
            <div class="dataScreen-main-chart">
              <RunningTrend :data="RunningTrendData" />
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
              <RunningCount :data="RunningCountData" />
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>插件使用统计—前4</span>
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
import ProcessStatus from "./components/ProcessStatus.vue";
import RunningCount from "./components/RunningCount.vue";
import RunningLog from "./components/RunningLog.vue";
import ProcessAlarm from "./components/ProcessAlarm.vue";
import Trigger from "./components/TriggerType.vue";
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
  getTriggerTypeRequest,
  getRunningInfoRequest
} from "@/api/data_screen/index";
import {
  BaseInfoType,
  PluginStatusType,
  ProcessAlarmType,
  TrendDataType,
  TriggerType,
  RunningInfoType
} from "@/api/data_screen/type";
const router = useRouter();

const toProcessInstance = () => {
  router.push(`/orderlines/taskInstance`);
};

const dataScreenRef = ref<HTMLElement | null>(null);

const plugin = ref<PluginStatusType[]>([]);
const Alarm = ref<ProcessAlarmType[]>([]);
const ProcessStatusData = ref([]);
const RunningCountData = ref({
  colors: [],
  columns: [],
  data: [{ label: "", value: [] }],
  unit: []
});
const RunningTrendData = ref<TrendDataType>({
  date: [],
  value: [],
  unit: []
});
const BaseInfoData = ref<BaseInfoType>({
  alarm_count: 0,
  free_space_mb: "",
  process_failure_total: 0,
  process_run_total: 0,
  process_success_total: 0,
  process_total: 0,
  safe_run_day: 0
});
let triggerData = ref<TriggerType>({
  schedule: 0,
  trigger: 0
});
let runningInfo = ref<RunningInfoType>({
  process_info: {
    name: "",
    process_instance_id: "",
    progress: 0,
    status: ""
  },
  running_task: {
    end_time: "",
    start_time: "",
    task_error: {},
    task_name: "",
    task_result: {
      status: ""
    },
    task_status: ""
  },
  task_nodes: [
    {
      color: "",
      icon: "",
      start_time: "",
      task_name: ""
    }
  ]
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
  await getRunningInfo();
});

const getRunningInfo = async () => {
  const res: any = await getRunningInfoRequest();
  if (res.code == 200) {
    runningInfo.value = res.data;
  } else {
    ElMessage.error("流程运行信息获取异常");
  }
};

const getTriggerType = async () => {
  const res: any = await getTriggerTypeRequest();
  if (res.code == 200) {
    triggerData.value = res.data;
  } else {
    ElMessage.error("启动方式获取异常");
  }
};

const getBaseInfo = async () => {
  const res: any = await getBaseInfoRequest();
  if (res.code == 200) {
    BaseInfoData.value = res.data;
  } else {
    ElMessage.error("基础信息获取异常");
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
    ElMessage.error("运行次数趋势获取异常");
  }
};

const getProcessStatus = async () => {
  const res: any = await getProcessStatusRequest();
  if (res.code == 200) {
    ProcessStatusData.value = res.data;
  } else {
    ElMessage.error("流程状态信息获取异常");
  }
};

const getPluginInfo = async () => {
  const pluginRes: any = await getPluginInfoRequest();
  if (pluginRes.code == 200) {
    plugin.value = pluginRes.data;
  } else {
    ElMessage.error("插件使用信息获取异常");
  }
};

const getAlarmData = async () => {
  const res: any = await getProcessAlarmRequest();
  if (res.code == 200) {
    Alarm.value = res.data;
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
