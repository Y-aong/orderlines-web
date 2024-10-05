<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <STATUS />
    <RESULT />
  </el-tabs>
</template>

<script lang="ts" setup>
import RESULT from "./result/index.vue";
import STATUS from "./status/index.vue";

import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import { processControlResult, processControlStatusItem } from "@/utils/variable";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { setStorage } from "@/utils/storage";
import { getGraphNodeDataRequest } from "@/api/flow/flowData/index";

let { nodeParam, process_id, nodeConfig } = storeToRefs(useFlowStore());

const activeName = ref("status");

const handleClick = async (tab: TabsPaneContext) => {
  const result: any = await getGraphNodeDataRequest(process_id.value, nodeConfig.value.task_id);
  let processControlParam = result.data.nodeParam;
  if (tab.props.name === "result" && processControlParam.pc_type === "result") {
    nodeParam.value = processControlParam;
    setStorage(processControlParam, "NODE_PARAM");
  } else if (tab.props.name === "result" && processControlParam.pc_type === "status") {
    nodeParam.value = JSON.parse(JSON.stringify(processControlResult));
    setStorage(JSON.parse(JSON.stringify(processControlResult)), "NODE_PARAM");
  } else if (tab.props.name === "status" && processControlParam.pc_type === "status") {
    nodeParam.value = processControlParam;
    setStorage(processControlParam, "NODE_PARAM");
  } else {
    nodeParam.value = JSON.parse(JSON.stringify(processControlStatusItem));
    setStorage(JSON.parse(JSON.stringify(processControlStatusItem)), "NODE_PARAM");
  }
};
</script>
<script lang="ts">
export default {
  name: "ProcessControl"
};
</script>

<style scoped></style>
