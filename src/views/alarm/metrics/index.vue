<template>
  <div class="table-box">
    <el-row :gutter="10">
      <!-- CPU占用 -->
      <el-col :span="3">
        <div class="pie">
          <gauge-chart :chart-size="'150px'" :refresh-interval="5" :api="getNodeMetricsGaugeCpuRequest" />
        </div>
      </el-col>
      <!-- 内存占用 -->
      <el-col :span="3">
        <div class="pie">
          <gauge-chart :chart-size="'150px'" :refresh-interval="5" :api="getNodeMetricsGaugeMemoryRequest" />
        </div>
      </el-col>
      <!-- 磁盘占用 -->
      <el-col :span="3">
        <div class="pie">
          <gauge-chart :chart-size="'150px'" :refresh-interval="5" :api="getNodeMetricsGaugeDiskRequest" />
        </div>
      </el-col>
      <!-- 内存占比 -->
      <el-col :span="3">
        <div class="pie">
          <PieChart :refresh-interval="0" chart-size="150px" :api="getNodeMetricsPieMemoryRequest" />
        </div>
      </el-col>
      <!-- 磁盘占比 -->
      <el-col :span="3">
        <div class="pie">
          <PieChart :refresh-interval="0" chart-size="150px" :api="getNodeMetricsPieDiskRequest" />
        </div>
      </el-col>
      <!-- SWAP占比 -->
      <el-col :span="3">
        <div class="pie">
          <PieChart :refresh-interval="0" chart-size="150px" :api="getNodeMetricsPieSwapRequest" />
        </div>
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
              <el-form :inline="true" :model="cpuInline" class="demo-form-inline">
                <el-form-item label="start time">
                  <el-date-picker
                    v-model="cpuInline.start_time"
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="end time">
                  <el-date-picker
                    v-model="cpuInline.end_time"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="step">
                  <el-input v-model="cpuInline.step" placeholder="步长" clearable size="small" style="width: 100px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="handleQuery(cpuInline)"> 查询 </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <div class="line">
            <LineChart
              :refresh-interval="60"
              chart-size="100%"
              :api="getNodeMetricsCpuLineRequest"
              :query="cpuInline"
            />
          </div>
        </el-card>
      </el-col>
      <!-- 内存图表 -->
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-title">
              <el-form :inline="true" :model="memoryInline" class="demo-form-inline">
                <el-form-item label="start time">
                  <el-date-picker
                    v-model="memoryInline.start_time"
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="end time">
                  <el-date-picker
                    v-model="memoryInline.end_time"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="step">
                  <el-input
                    v-model="memoryInline.step"
                    placeholder="步长"
                    clearable
                    size="small"
                    style="width: 100px"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="handleQuery(memoryInline)"> 查询 </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <div class="line">
            <LineChart
              :refresh-interval="60"
              chart-size="100%"
              :api="getNodeMetricsMemoryLineRequest"
              :query="memoryInline"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <!-- 网络图表 -->
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-title">
              <el-form :inline="true" :model="networkInline" class="demo-form-inline">
                <el-form-item label="start time">
                  <el-date-picker
                    v-model="networkInline.start_time"
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="end time">
                  <el-date-picker
                    v-model="networkInline.end_time"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="step">
                  <el-input
                    v-model="networkInline.step"
                    placeholder="步长"
                    clearable
                    size="small"
                    style="width: 100px"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="handleQuery(networkInline)"> 查询 </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <div class="line">
            <LineChart
              :refresh-interval="60"
              chart-size="100%"
              :api="getNodeMetricsNetworkLineRequest"
              :query="networkInline"
            />
          </div>
        </el-card>
      </el-col>
      <!-- 磁盘图表 -->
      <el-col :span="12">
        <el-card class="line-card">
          <template #header>
            <div class="card-title">
              <el-form :inline="true" :model="diskInline" class="demo-form-inline">
                <el-form-item label="start time">
                  <el-date-picker
                    v-model="diskInline.start_time"
                    type="datetime"
                    placeholder="开始时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="end time">
                  <el-date-picker
                    v-model="diskInline.end_time"
                    type="datetime"
                    placeholder="结束时间"
                    style="width: 150px"
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="step">
                  <el-input v-model="diskInline.step" placeholder="步长" clearable size="small" style="width: 100px" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="handleQuery(diskInline)"> 查询 </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <div class="line">
            <LineChart
              :refresh-interval="5"
              chart-size="100%"
              :api="getNodeMetricsDiskLineRequest"
              :query="diskInline"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // 导入 UTC 插件
import timezone from "dayjs/plugin/timezone"; // 导入时区插件
import GaugeChart from "./components/GaugeChart.vue";
import LineChart from "./components/LineChart.vue";
import PieChart from "./components/PieChart.vue";

// 使用插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 引入 API 请求方法
import {
  getNodeMetricsMemoryLineRequest,
  getNodeMetricsCpuLineRequest,
  getNodeMetricsNetworkLineRequest,
  getNodeMetricsDiskLineRequest,
  getNodeMetricsPieMemoryRequest,
  getNodeMetricsPieSwapRequest,
  getNodeMetricsPieDiskRequest,
  getNodeMetricsGaugeMemoryRequest,
  getNodeMetricsGaugeCpuRequest,
  getNodeMetricsGaugeDiskRequest
} from "@/api/alarm/instance/index";

// 创建一个方法来处理日期格式转换
const formatDateTime = (
  dateTime?: string | null,
  targetTimeZone: string = "Asia/Shanghai",
  format: string = "YYYY-MM-DD HH:mm:ss"
) => {
  if (!dateTime) return "";
  return dayjs(dateTime).tz(targetTimeZone).format(format);
};

// 处理查询逻辑的方法
const handleQuery = async (inlineData: any) => {
  // 格式化日期并更新到 inlineData 中
  const formattedStartTime = formatDateTime(inlineData.start_time);
  const formattedEndTime = formatDateTime(inlineData.end_time);

  Object.assign(inlineData, {
    start_time: formattedStartTime,
    end_time: formattedEndTime
  });
};

// 定义各个表单的数据模型
const cpuInline = reactive({
  start_time: "",
  end_time: "",
  step: "",
  instance_name: ""
});

const memoryInline = reactive({
  start_time: "",
  end_time: "",
  step: "",
  instance_name: ""
});

const networkInline = reactive({
  start_time: "",
  end_time: "",
  step: "",
  instance_name: ""
});

const diskInline = reactive({
  start_time: "",
  end_time: "",
  step: "",
  instance_name: ""
});

let nodeMetics = ref({
  cpu_total: "8",
  boot_time: "12",
  memory_total_gb: "16GB",
  disk_total_gb: "500GB",
  swap_total_gb: "4GB"
});
</script>

<style scoped>
.table-box {
  width: 100%;
}
.line-chat {
  width: 100%;
  height: 100%;
}
</style>

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
  height: 26vh;
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
