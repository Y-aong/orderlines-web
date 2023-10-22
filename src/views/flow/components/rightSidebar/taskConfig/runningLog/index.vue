<template>
  <div>
    <el-collapse-item title="任务运行日志" name="runningLog">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>
              任务名称: <el-tag>{{ runningTask.task_name }}</el-tag>
            </span>
            <div>
              <el-button size="small" icon="View" type="primary" circle></el-button>
              <el-button size="small" icon="BellFilled" type="warning" circle></el-button>
            </div>
          </div>
        </template>
        <div class="card-context">
          <div>
            任务状态：<el-tag>{{ runningTask.task_status }}</el-tag>
          </div>
          <div>开始时间：{{ runningTask.start_time }}</div>
          <div>结束时间：{{ runningTask.end_time }}</div>
        </div>
      </el-card>
    </el-collapse-item>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
const { runningTask } = storeToRefs(useFlowStore());
</script>
<script lang="ts">
export default {
  name: "TaskResultParam"
};
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
}
.card-context {
  font-size: 14px;
}
.box-card {
  width: 100%;
  height: 250px;
}
</style>
