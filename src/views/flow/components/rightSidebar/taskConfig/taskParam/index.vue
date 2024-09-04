<template>
  <el-collapse-item title="任务参数配置" name="taskParams">
    <template v-if="nodeConfig.task_type === 'process_control'">
      <ProcessControl />
    </template>
    <template v-if="nodeConfig.task_type === 'group'">
      <TaskGroup />
    </template>
    <template v-if="nodeConfig.task_type === 'sub_process'">
      <SubProcess />
    </template>
    <template v-if="nodeConfig.task_type === 'common'">
      <Common />
    </template>
    <template v-if="nodeConfig.task_type === 'parallel'">
      <Parallel />
    </template>
  </el-collapse-item>
</template>

<script setup lang="ts" name="TaskParam">
import ProcessControl from "./processControl/index.vue";
import TaskGroup from "./taskGroup/index.vue";
import SubProcess from "./subProcess/index.vue";
import Common from "./common/index.vue";
import Parallel from "./parallel/index.vue";

import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";

const { nodeConfig } = storeToRefs(useFlowStore());
</script>

<style scoped>
.tooltip-base-box .center {
  justify-content: center;
}
</style>
