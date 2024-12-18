<template>
  <div class="table-box">
    <el-row :gutter="10">
      <!-- CPU占用 -->
      <el-col :span="3">
        <div class="pie"><gauge-chart :chart-size="'150px'" :refresh-interval="5" :option="CPUGaugeOption" /></div>
      </el-col>
      <!-- 内存占用 -->
      <el-col :span="3">
        <div class="pie"><gauge-chart :chart-size="'150px'" :refresh-interval="5" :option="MemoryGaugeOption" /></div>
      </el-col>
      <!-- 磁盘占用 -->
      <el-col :span="3">
        <div class="pie"><gauge-chart :chart-size="'150px'" :refresh-interval="5" :option="DiskGaugeOption" /></div>
      </el-col>
      <!-- 内存占比 -->
      <el-col :span="3">
        <div class="pie"><PieChart :refresh-interval="0" chart-size="150px" :option="memoryOption" /></div>
      </el-col>
      <!-- 磁盘占比 -->
      <el-col :span="3">
        <div class="pie"><PieChart :refresh-interval="0" chart-size="150px" :option="diskOption" /></div>
      </el-col>
      <!-- SWAP占比 -->
      <el-col :span="3">
        <div class="pie"><PieChart :refresh-interval="0" chart-size="150px" :option="swapOption" /></div>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="5">
          <el-col :span="12">
            <div class="node-item">
              <el-text>CPU数量：{{ nodeMetics.cpu_total }}</el-text>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="node-item">
              <el-text>开机时间：{{ nodeMetics.boot_time }}</el-text>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <div class="node-item">
              <el-text truncated>memory：{{ nodeMetics.memory_total_gb }}</el-text>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="node-item">
              <el-text truncated>disk：{{ nodeMetics.disk_total_gb }}</el-text>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="node-item">
              <el-text truncated>swap：{{ nodeMetics.swap_total_gb }}</el-text>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 图表 -->
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-title">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="start time">
                  <el-date-picker
                    v-model="formInline.date"
                    type="date"
                    placeholder="开始时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="end time">
                  <el-date-picker
                    v-model="formInline.date"
                    type="date"
                    placeholder="结束时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="step">
                  <el-input v-model="formInline.user" placeholder="步长" clearable size="small" style="width: 100px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <div class="line">
            <LineChart :refresh-interval="60" chart-size="100%" :option="CPUlineOption" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="start time">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="开始时间"
                      style="width: 150px"
                      clearable
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="end time">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="结束时间"
                      style="width: 150px"
                      clearable
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="step">
                    <el-input
                      v-model="formInline.user"
                      placeholder="步长"
                      clearable
                      size="small"
                      style="width: 100px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>
          <div class="line">
            <LineChart :refresh-interval="60" chart-size="100%" :option="lineOption" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="start time">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="开始时间"
                      style="width: 150px"
                      clearable
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="end time">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="结束时间"
                      style="width: 150px"
                      clearable
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="step">
                    <el-input
                      v-model="formInline.user"
                      placeholder="步长"
                      clearable
                      size="small"
                      style="width: 100px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>
          <div class="line">
            <LineChart :refresh-interval="60" chart-size="100%" :option="CPUlineOption" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="start time">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="开始时间"
                      style="width: 150px"
                      clearable
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="end time">
                    <el-date-picker
                      v-model="formInline.date"
                      type="date"
                      placeholder="结束时间"
                      style="width: 150px"
                      clearable
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="step">
                    <el-input
                      v-model="formInline.user"
                      placeholder="步长"
                      clearable
                      size="small"
                      style="width: 100px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </template>
          <div class="line">
            <LineChart :refresh-interval="60" chart-size="100%" :option="lineOption" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import GaugeChart from "./components/GaugeChart.vue";
import LineChart from "./components/LineChart.vue";
import PieChart from "./components/PieChart.vue";
import {
  getPrometheusNodeMetricsRequest,
  getPrometheusNodeMetricsNetworkRequest,
  getPrometheusNodeMetricsCPURequest,
  getPrometheusNodeMetricsMemoryRequest
} from "@/api/alarm/alarmInstance/index";
import { PrometheusNodeMetrics } from "@/api/alarm/alarmInstance/type";

import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
const fontSize = ref(15);
const formInline = reactive({
  user: "",
  region: "",
  date: ""
});

let nodeMetics = ref<PrometheusNodeMetrics.PrometheusNodeMetrics>({
  cpu_usage: 70,
  memory_usage: 60,
  disk_usage: 9,
  disk_used_data: [
    { value: 2143, name: "已用内存" },
    { value: 1541, name: "未用内存" }
  ],
  memory_used_data: [
    { value: 1548, name: "已用磁盘" },
    { value: 4345, name: "未用磁盘" }
  ],
  swap_used_data: [
    { value: 542, name: "已用磁盘" },
    { value: 4345, name: "未用磁盘" }
  ],
  cpu_total: "8",
  boot_time: "12",
  memory_total_gb: "16GB",
  disk_total_gb: "500GB",
  swap_total_gb: "4GB"
});
// 定时器
const timer = ref();

// 获取数据
const getMetricsData = async () => {
  const nodeMetricsResponse = await getPrometheusNodeMetricsRequest("ubantu-node", "15m");
  console.log(nodeMetricsResponse.data);
  // nodeMetics.value = nodeMetricsResponse.data;
  console.log("nodeMetics", nodeMetics);

  const nodeMetricsNetworkResponse = await getPrometheusNodeMetricsNetworkRequest();
  console.log(nodeMetricsNetworkResponse);

  const nodeMetricsCpuResponse = await getPrometheusNodeMetricsCPURequest();
  console.log(nodeMetricsCpuResponse);
  const nodeMetricsMemoryResponse = await getPrometheusNodeMetricsMemoryRequest();
  console.log(nodeMetricsMemoryResponse);

  function _timer() {
    timer.value = setTimeout(() => {
      getMetricsData();
    }, 5000);
  }
  // 启动定时器
  _timer();
};

// 定义仪表盘配置
const CPUGaugeOption = ref({ series: [{ data: [{ value: nodeMetics.value.cpu_usage, name: "CPU" }] }] });
const MemoryGaugeOption = ref({ series: [{ data: [{ value: nodeMetics.value.memory_usage, name: "内存" }] }] });
const DiskGaugeOption = ref({ series: [{ data: [{ value: nodeMetics.value.disk_usage, name: "磁盘" }] }] });

// 饼图配置
const memoryOption = ref({
  title: { text: "内存占比", textStyle: { fontSize: fontSize } },
  series: [
    {
      type: "pie",
      data: [
        { value: 1548, name: "已用磁盘" },
        { value: 4345, name: "未用磁盘" }
      ]
    }
  ]
});

const diskOption = ref({
  title: { text: "磁盘占比", textStyle: { fontSize: fontSize } },
  series: [{ type: "pie", data: nodeMetics.value.memory_used_data }]
});
const swapOption = {
  title: {
    text: "SWAP占比",
    textStyle: {
      fontSize: fontSize
    }
  },
  series: [
    {
      type: "pie",
      data: nodeMetics.value.memory_used_data
    }
  ]
};
// 折线图配置
const CPUlineOption = {
  title: {
    text: "CPU折线图标题",
    textStyle: {
      fontSize: fontSize
    }
  },
  series: [{ name: "销量", showSymbol: false, type: "line", data: [150, 230, 224, 218, 135, 147, 260, 41] }]
};
const lineOption = {
  title: {
    text: "折线图标题",
    textStyle: {
      fontSize: fontSize
    }
  },

  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  ],

  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      showSymbol: false,
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: "Union Ads",
      type: "line",
      stack: "Total",
      showSymbol: false,
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: "Video Ads",
      type: "line",
      showSymbol: false,
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: "Direct",
      type: "line",
      stack: "Total",
      showSymbol: false,
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: "Search Engine",
      type: "line",
      stack: "Total",
      showSymbol: false,
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};

// 在组件销毁前清除定时器(离开页面)
onBeforeUnmount(() => {
  // 关闭定时器
  clearTimeout(timer.value);
  console.log("定时器已清除");
});

onMounted(async () => {
  await getMetricsData();
});
</script>

<style scoped>
.line-card {
  bottom: 5px;
  height: 33vh;
  margin-bottom: 5px;
  text-align: center;
  background: #fcfcfc;
  border: #cfc8c8 solid 1px;
  border-radius: 5px;
}
.line {
  display: flex;
  justify-content: center; /* 水平居中 */
  height: 25vh;
}
.pie {
  display: flex;
  justify-content: center; /* 水平居中 */
  width: 100%;
  height: 160px;
  margin-bottom: 10px;
  text-align: center;
  border: #cfc8c8 solid 1px;
}
.node-item {
  display: flex;
  justify-content: center; /* 水平居中 */
  height: 76px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border: #cfc8c8 solid 1px;
}
.card-title {
  height: 20px;
}
</style>
