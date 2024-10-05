<template>
  <el-collapse-item title="任务结果配置" name="taskResult">
    <el-table :data="nodeResult" style="width: 100%" :max-height="height" :height="height" stripe>
      <el-table-column prop="name" label="返回值名称" min-width="120" width="145" />
      <el-table-column label="返回值" min-width="190" width="240">
        <template #default="scope">
          <el-select
            v-model="scope.row.result_key"
            :placeholder="`${scope.row.type}下拉框使用变量`"
            filterable
            :disabled="isRunning"
            style="width: 220px"
            @click="getVariableOption"
            @change="updateTask(scope.row.name, scope.row.result_key)"
          >
            <el-option v-for="(item, index) in variableOption" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="width: 100%" type="primary" @click="dialogTableVisible = true"> 查看返回值 </el-button>
  </el-collapse-item>
  <el-dialog v-model="dialogTableVisible" :title="`${nodeConfig.task_name}——返回值说明`">
    <el-table :data="nodeResult" style="width: 100%" border>
      <el-table-column prop="name" label="返回值名称" min-width="150" />
      <el-table-column prop="result_key" label="返回值参数" min-width="150" />
      <el-table-column label="默认值" min-width="120">
        <template #default="scope">
          <el-tag disable-transitions>
            {{ scope.row.default ? scope.row.default : "无默认值" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述信息" min-width="150" />
      <el-table-column prop="required" label="是否必填" min-width="150" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts" name="TaskResultParam">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { getProcessVariableOptionRequest } from "@/api/option/index";
import { createGraphNodeRequest } from "@/api/flow/flowData/index";
import { FlowNode } from "@/api/flow/flowData/type";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { ElMessage } from "element-plus";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";
import useFlowStatueStore from "@/stores/modules/flowStatue";

let dialogTableVisible = ref<boolean>(false);
let variableOption = ref<any>([]);

const { nodeConfig, nodeResult, process_id } = storeToRefs(useFlowStore());
const { isRunning } = storeToRefs(useFlowStatueStore());
const height = ref(isRunning ? "30vh" : "65vh");

const getVariableOption = async () => {
  const result = await getProcessVariableOptionRequest(process_id.value);
  variableOption.value = result.data;
};

// 修改流程图数据
const updateFlowData = async () => {
  const graph_node: FlowNode.GraphNode = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeResult: nodeResult.value
  };
  await createGraphNodeRequest(graph_node);
};

// 修改任务参数
const updateTask = async (result_name: string, result_value: string) => {
  if (result_name && result_value) {
    await updateFlowData();
    let result_config = {
      result_key: result_name,
      variable_key: result_value
    };
    let taskNode: Task.TaskItem = {
      id: nodeConfig.value.id,
      task_id: nodeConfig.value.task_id,
      process_id: process_id.value,
      result_config: result_config
    };
    let result: any = await updateTaskRequest(taskNode);
    if (result.code != 200) ElMessage.error("任务配置修改失败");
  } else {
    ElMessage.error("任务配置修改失败");
  }
};
</script>

<style scoped></style>
