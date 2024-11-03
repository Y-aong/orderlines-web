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
import useGraphStore from "@/stores/modules/graph";
import useProcessControlStore from "@/stores/modules/processControl";
import { taskStatusOptions } from "@/utils/variable";
import { ref } from "vue";
import { createGraphNodeRequest, getGraphNodeDataRequest } from "@/api/graph/graphData/index";
import { GraphNode } from "@/api/graph/graphData/type";
import { getPrevNodeResultOptionRequest } from "@/api/option/index";
import { Option } from "@/api/option/type";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { ElMessage } from "element-plus";
import { setStorage } from "@/utils/storage";
import { OptionItemType } from "@/api/interface/index";
import "vue3-json-viewer/dist/index.css";
import { BaseResponse } from "@/api/interface/index";
import useGraphStatueStore from "@/stores/modules/graphStatue";
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());
let { processControlOptions, processControlStatus } = storeToRefs(useProcessControlStore());
let { nodeParam, process_id, nodeConfig } = storeToRefs(useGraphStore());
let { isRunning } = storeToRefs(useGraphStatueStore());
let taskIdOption = ref<OptionItemType[]>([{ label: "", value: "" }]);
let visible = ref(false);
let depth = ref(5);
let theme = ref("vs-code");

// 获取任务状态选项
const getTaskIdOption = async () => {
  let response: BaseResponse<Option.PrevNodeResult> = await getPrevNodeResultOptionRequest(
    nodeConfig.value.task_id,
    process_id.value
  );
  if (response.code === 200 && response.data.pre_task_config.length !== 0) {
    taskIdOption.value = response.data.pre_task_config;
  } else {
    ElMessage.error("流程控制节点没有前置任务");
  }
};

// 查看流程控制参数
const checkParam = () => {
  visible.value = true;
};
// 获取流程控制参数
const getProcessControlParam = async () => {
  const response: BaseResponse = await getGraphNodeDataRequest(process_id.value, nodeConfig.value.task_id);
  nodeParam.value = response.data.nodeParam;
  setStorage(response.data.nodeParam, "NODE_PARAM");
};

// 修改流程图节点数据
const updateFlowData = async () => {
  const graph_data: GraphNode.GraphNode = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeParam: nodeParam.value
  };
  await createGraphNodeRequest(graph_data);
};

// 修改流程控制参数
const updateProcessControlParam = async () => {
  for (let i = 0; i < nodeParam.value.conditions.length; i++) {
    let conditionTaskId = nodeParam.value.conditions[i].task_id;
    let condition = nodeParam.value.conditions[i].condition;
    if (conditionTaskId === "") {
      ElMessage.error("流程控制条件未设置");
      return;
    }
    condition.forEach((conditionItem: any) => {
      if (conditionItem.condition == "" || conditionItem.task_status == "") {
        ElMessage.error("流程任务分支未设置");
        return;
      }
    });
  }

  let taskNode = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    method_kwargs: nodeParam.value,
    updater_name: userInfo.value.login_value
  };
  await updateTaskRequest(taskNode);
  await updateFlowData();
  await getProcessControlParam();
  ElMessage.success("保存流程控制参数成功");
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
