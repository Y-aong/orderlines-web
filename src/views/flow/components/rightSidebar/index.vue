<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="任务配置" name="task_config">
      <TaskConfig></TaskConfig>
    </el-tab-pane>
    <el-tab-pane label="变量配置" name="variable_config">
      <VariableConfig></VariableConfig>
    </el-tab-pane>
    <el-tab-pane label="流程配置" name="process_config">
      <ProcessConfig></ProcessConfig>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TaskConfig from "./taskConfig/index.vue";
import VariableConfig from "./variableConfig/index.vue";
import ProcessConfig from "./processConfig/index.vue";

const activeName = ref("task_config");
</script>

<script lang="ts">
export default {
  name: "FlowRightSidebar"
};
</script>

<style scoped></style>
