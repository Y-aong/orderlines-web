<template>
  <el-card class="right_config_sidebar">
    <div class="task_config">
      <div class="task_running_config">
        <el-form :inline="true" v-if="!isRunning" :label-position="labelPosition">
          <h3>任务配置</h3>
          <el-form-item label="任务序号" style="width: 95%" required>
            <el-input v-model="nodeConfig.task_id" disabled />
          </el-form-item>
          <el-form-item label="任务名称" style="width: 95%" required>
            <el-input v-model="nodeConfig.task_name" disabled />
          </el-form-item>
          <el-form-item label="插件版本" style="width: 95%" required>
            <el-input
              placeholder="请输入插件版本"
              clearable
              :model-value="nodeConfig.version"
              @blur="updateTask"
              :disabled="isRunning ? true : false || nodeConfig.id === 0"
            />
          </el-form-item>
          <el-form-item label="任务描述" style="width: 95%" required>
            <el-input
              placeholder="请输入任务描述"
              clearable
              v-model="nodeConfig.desc"
              @blur="updateTask"
              :disabled="isRunning ? true : false || nodeConfig.id === 0"
            />
          </el-form-item>
        </el-form>

        <!-- 设置任务运行时 -->
        <el-collapse :model-value="isRunning ? ['runningImage', 'clickCheck'] : ['taskParams']" :accordion="!isRunning">
          <TaskParam v-if="!isRunning" />
          <TaskResultParam v-if="!isRunning" />
          <TaskRunningConfig v-if="!isRunning" />
          <clickCheckTask v-if="isRunning" />
        </el-collapse>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts" name="TaskConfig">
import TaskParam from "./taskParam/index.vue";
import TaskResultParam from "./taskResult/index.vue";
import TaskRunningConfig from "./taskConfig/index.vue";
import clickCheckTask from "./taskRunning/logger/index.vue";
import { storeToRefs } from "pinia";
import useGraphStore from "@/stores/modules/graph";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { ElMessage } from "element-plus";
import type { FormProps } from "element-plus";
import { ref } from "vue";
import useGraphStatueStore from "@/stores/modules/graphStatue";
const { isRunning } = storeToRefs(useGraphStatueStore());
const labelPosition = ref<FormProps["labelPosition"]>("right");
const { nodeConfig, process_id } = storeToRefs(useGraphStore());

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
