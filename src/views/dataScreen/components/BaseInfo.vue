<template>
  <div class="base-info">
    <div class="run-image">
      <img src="../images/run_days.png" alt="" />
      <div class="run-day">
        已运行
        <span class="number">{{ baseInfo.safe_run_day }}</span>
        天
      </div>
    </div>
    <div class="statistic-card">
      <div class="statistic-font">
        流程总量 <span>{{ baseInfo.process_total }}</span>
      </div>
      <div class="statistic-font">成功总量 {{ baseInfo.process_success_total }}</div>
      <div class="statistic-font">失败总量 {{ baseInfo.process_failure_total }}</div>
      <div class="statistic-font">运行总量 {{ baseInfo.process_run_total }}</div>
      <div class="statistic-font">告警数量 {{ baseInfo.alarm_count }}</div>
      <div class="statistic-font">可用内存 {{ baseInfo.free_space_mb }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";

interface Props {
  data: any;
}
let baseInfo = ref<any>({
  alarm_count: 0,
  free_space_mb: "",
  process_failure_total: 0,
  process_run_total: 0,
  process_success_total: 0,
  process_total: 0,
  safe_run_day: 0
});
const props = defineProps<Props>();

watch(props, () => {
  baseInfo.value = props.data;
});
</script>

<style scoped>
.base-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: #19182a;
}
.run-image {
  width: 40%;
  height: 100%;
}
.statistic-card {
  width: 50%;
  height: 100%;
  padding-top: 60px;
  font-size: 20px;
  line-height: 30px;
  color: #eeeeee;
}
.run-day {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}
.number {
  color: #66ffff;
}
</style>
