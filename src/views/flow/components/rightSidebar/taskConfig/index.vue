<template>
  <el-card class="right_config_sidebar">
    <div class="task_config">
      <div class="task_running_config">
        <el-form :inline="true" v-if="!isRunning">
          <h3>任务配置</h3>
          <el-form-item label="任务序号" style="width: 95%">
            <el-input v-model="nodeConfig.task_id" disabled />
          </el-form-item>
          <el-form-item label="任务名称" style="width: 95%">
            <el-input v-model="nodeConfig.task_name" disabled />
          </el-form-item>
          <el-form-item label="任务描述" style="width: 95%">
            <el-input
              placeholder="请输入任务描述"
              clearable
              v-model="nodeConfig.desc"
              @blur="updateTask"
              :disabled="isRunning ? true : false"
            />
          </el-form-item>
          <el-form-item label="插件版本" style="width: 95%">
            <el-input
              placeholder="请输入插件版本"
              clearable
              :model-value="nodeConfig.version"
              @blur="updateTask"
              :disabled="isRunning ? true : false"
            />
          </el-form-item>
        </el-form>
        <el-collapse :model-value="isRunning ? ['runningImage', 'clickCheck'] : ['taskParams']" :accordion="!isRunning">
          <TaskParam v-if="!isRunning" />
          <TaskResultParam v-if="!isRunning" />
          <TaskRunningConfig v-if="!isRunning" />
          <clickCheckTask v-if="isRunning" />
          <RunningImage v-if="isRunning" />
          <!-- <RunningLog v-if="isRunning" /> -->
        </el-collapse>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import TaskParam from "./taskParam/index.vue";
import TaskResultParam from "./taskResult/index.vue";
import TaskRunningConfig from "./taskRunning/index.vue";
// import RunningLog from "./runningLog/index.vue";
import RunningImage from "./runningImage/index.vue";
import clickCheckTask from "./clickCheck/index.vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { updateTaskRequest } from "@/api/orderlines/task/index";
import { ElMessage } from "element-plus";

let { nodeConfig, process_id, isRunning } = storeToRefs(useFlowStore());

// 修改任务
const updateTask = async () => {
  let taskNode: any = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    task_name: nodeConfig.value.task_name,
    desc: nodeConfig.value.desc
  };
  let result: any = await updateTaskRequest(taskNode);
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};
</script>

<script lang="ts">
export default {
  name: "TaskConfig"
};
</script>

<style scoped>
.right_config_sidebar {
  width: 100%;
  height: 100vh;
  background: #ffffff;
}
.task_config {
  flex-direction: column;
}
</style>
