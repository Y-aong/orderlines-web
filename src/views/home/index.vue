<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">数据可视化</div>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="item-left sle">
              <span class="left-title">今日流程总运行数量</span>
              <div class="img-box">
                <img src="./images/book-sum.png" alt="" />
              </div>
              <span class="left-number">{{ runNumber.total_number }}</span>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-center">
              <div class="gitee-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/add_person.png" alt="" />
                </div>
                <span class="item-value">{{ runNumber.success_total_number }}</span>
                <span class="traffic-name sle">运行成功总量</span>
              </div>
              <div class="gitHub-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/add_team.png" alt="" />
                </div>
                <span class="item-value">{{ runNumber.failure_total_number }}</span>
                <span class="traffic-name sle">运行失败总量</span>
              </div>
              <div class="today-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/today.png" alt="" />
                </div>
                <span class="item-value">{{ runNumber.current_success_total_number }}</span>
                <span class="traffic-name sle">今日运行成功量</span>
              </div>
              <div class="yesterday-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="item-value">{{ runNumber.current_failure_total_number }}</span>
                <span class="traffic-name sle">今日运行失败量</span>
              </div>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <div class="item-right">
              <div class="echarts-title">流程告警</div>
              <div class="book-echarts">
                <Pie ref="pieRef" :pie-data="pieData" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card bottom-box">
      <div class="bottom-title">运行状态分布</div>
      <div class="bottom-tabs">
        <el-tabs v-model="tabActive" @tab-click="getCurve" class="demo-tabs">
          <el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name" />
        </el-tabs>
      </div>
      <div class="curve-echarts">
        <Curve ref="curveRef" :curve-data="curveData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import { ref, onMounted } from "vue";
import Pie from "./components/pie.vue";
import Curve from "./components/curve.vue";
import { getRunNumber, getAlarmCount, getCurveData } from "@/api/home/index";
import { pieType, curveDataType } from "@/api/home/type";
import type { TabsPaneContext } from "element-plus";

let runNumber = ref({
  failure_total_number: 0,
  current_failure_total_number: 0,
  current_success_total_number: 0,
  success_total_number: 0,
  total_number: 0
});

let pieData = ref<pieType[]>([
  { value: 0, name: "运行成功" },
  { value: 0, name: "运行失败" },
  { value: 0, name: "运行停止" },
  { value: 0, name: "运行超时" }
]);

let curveData = ref<curveDataType[]>([
  { value: 0, spotName: "运行成功" },
  { value: 0, spotName: "运行失败" },
  { value: 0, spotName: "运行超时" },
  { value: 0, spotName: "运行暂停" },
  { value: 0, spotName: "运行继续" },
  { value: 0, spotName: "运行停止" },
  { value: 0, spotName: "运行排队" },
  { value: 0, spotName: "运行中" }
]);

const tabActive = ref("month");

onMounted(async () => {
  const runNumberData: any = await getRunNumber();
  if (runNumberData.code === 200) {
    runNumber.value = runNumberData.data;
  }

  const RunStatusData: any = await getAlarmCount();
  if (RunStatusData.code === 200) {
    pieData.value = RunStatusData.data;
  }

  const res: any = await getCurveData("month");
  if (res.code === 200) {
    curveData.value = res.data;
  }
});
const getCurve = async (tab: TabsPaneContext) => {
  let paneName = tab.paneName ? tab.paneName : "week";
  const res: any = await getCurveData(paneName as string);
  if (res.code === 200) {
    curveData.value = res.data;
  }
};

const tab = [
  { label: "昨日", name: "day" },
  { label: "近七日", name: "week" },
  { label: "近一月", name: "month" }
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
