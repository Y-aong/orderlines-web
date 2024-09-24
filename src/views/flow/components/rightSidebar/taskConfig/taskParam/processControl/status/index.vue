<template>
  <el-tab-pane label="任务状态" name="status">
    <template v-if="processControlStatus.pc_type === 'status'">
      <p>流程控制——任务状态</p>
      <el-table :data="processControlStatus.conditions" style="width: 100%" title>
        <el-table-column label="任务条件" min-width="90">
          <template #default="scope">
            <el-select
              v-model="scope.row.condition[0].condition"
              placeholder="请选择条件"
              @click="getTaskIdOption"
              :disabled="isRunning"
            >
              <el-option v-for="item in taskIdOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="运行状态" min-width="100">
          <template #default="scope">
            <el-select v-model="scope.row.condition[0].task_status" placeholder="请选择任务状态" :disabled="isRunning">
              <el-option v-for="item in taskStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="任务分支" min-width="100">
          <template #default="scope">
            <el-select v-model="scope.row.task_id" placeholder="请选择任务分支" :disabled="isRunning">
              <el-option
                v-for="item in processControlOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="button">
      <el-button style="width: 50%" type="primary" @click="updateProcessControlParam">保存</el-button>
      <el-button style="width: 50%" type="success" @click="checkParam">查看</el-button>
    </div>
  </el-tab-pane>

  <el-dialog v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog_header">
        <h4 :id="titleId" :class="titleClass">查看流程控制参数——任务运行状态</h4>
        <el-button type="danger" @click="close"> Close </el-button>
      </div>
    </template>
    <json-viewer :value="nodeParam" copyable boxed sort expanded :expand-depth="depth" :theme="theme" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import useProcessControlStore from "@/stores/modules/processControl";
import { taskStatusOptions } from "@/utils/variable";
import { ref } from "vue";
import { createTaskFlowDataRequest, getFlowTaskDataRequest } from "@/api/flow/taskNode/index";
import { getPrevNodeResultRequest } from "@/api/flow/processControl/index";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { ElMessage } from "element-plus";
import { setStorage } from "@/utils/storage";
import { OptionItemType } from "@/api/interface/index";
import "vue3-json-viewer/dist/index.css";
import { BaseResponse } from "@/api/interface/index";
import useFlowStatueStore from "@/stores/modules/flowStatue";

let { processControlOptions, processControlStatus } = storeToRefs(useProcessControlStore());

let { nodeParam, process_id, nodeConfig } = storeToRefs(useFlowStore());
let { isRunning, isEdit, isSave } = storeToRefs(useFlowStatueStore());
let taskIdOption = ref<OptionItemType[]>([{ label: "", value: "" }]);
let visible = ref(false);
let depth = ref(5);
let theme = ref("vs-code");

const getTaskIdOption = async () => {
  let preTaskConfigResponse: any = await getPrevNodeResultRequest(nodeConfig.value.task_id, process_id.value);
  if (preTaskConfigResponse.code === 200) {
    taskIdOption.value = preTaskConfigResponse.data.pre_task_config;
  }
};

const checkParam = () => {
  visible.value = true;
};

const getProcessControlParam = async () => {
  const result: BaseResponse = await getFlowTaskDataRequest(process_id.value, nodeConfig.value.task_id);
  nodeParam.value = result.data.nodeParam;
  setStorage(result.data.nodeParam, "NODE_PARAM");
};

// 修改流程图数据
const updateFlowData = async () => {
  const update_task_param_flow = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeParam: nodeParam.value
  };
  await createTaskFlowDataRequest(update_task_param_flow);
};

// 修改流程控制参数
const updateProcessControlParam = async () => {
  let taskNode = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    method_kwargs: nodeParam.value
  };
  await updateTaskRequest(taskNode);
  await updateFlowData();
  await getProcessControlParam();
  ElMessage.success("保存流程控制参数成功");
  isEdit.value = true;
  isSave.value = false;
};
</script>

<script lang="ts">
export default {
  name: "STATUS"
};
</script>

<style scoped>
p {
  padding: 0;
  font-size: 13px;
  font-weight: bold;
}
.button {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.dialog_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
