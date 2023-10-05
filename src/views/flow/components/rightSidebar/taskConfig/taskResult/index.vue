<template>
  <el-collapse-item title="任务结果配置" name="taskResult">
    <el-table :data="nodeResult" style="width: 100%" :max-height="height" :height="height" stripe>
      <el-table-column prop="name" label="返回值名称" min-width="120" width="145" />
      <el-table-column label="返回值" min-width="190" width="240">
        <template #default="scope">
          <el-select
            v-model="scope.row.result_key"
            :placeholder="`${scope.row.type}下拉框使用变量`"
            clearable
            filterable
            :disabled="isRunning"
            style="width: 220px"
            @click="getVariableOption"
            @blur="updateTask(scope.row.name, scope.row.result_key)"
          >
            <el-option v-for="(item, index) in variableOption" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="width: 100%" type="primary" @click="cancel"> 查看返回值 </el-button>
  </el-collapse-item>
  <el-dialog v-model="dialogTableVisible" :title="`${nodeConfig.task_name}——返回值说明`">
    <el-table :data="nodeResult" style="width: 100%" border>
      <el-table-column prop="name" label="参数名称" min-width="150" />
      <el-table-column label="默认值" min-width="120">
        <template #default="scope">
          {{ scope.row }}
          <el-tag disable-transitions>
            {{ nodeResult.required === undefined ? "无" : "有" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述信息" min-width="150" />
      <el-table-column prop="required" label="是否必填" min-width="150" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { TaskNodeType } from "@/api/flow/type";
import { createTaskFlowDataRequest, getVariableOptionRequest, updateTaskRequest } from "@/api/flow";
import { notice } from "@/utils/notice";

let dialogTableVisible = ref<boolean>(false);
let variableOption = ref<any>([]);

const { nodeConfig, nodeResult, process_id, isRunning } = storeToRefs(useFlowStore());
const height = ref(isRunning ? "30vh" : "65vh");

const getVariableOption = async () => {
  const result = await getVariableOptionRequest(process_id.value);
  variableOption.value = result.data;
};

const cancel = () => {
  dialogTableVisible.value = true;
};

// 修改流程图数据
const updateFlowData = async () => {
  const update_flow_param = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeResult: nodeResult.value
  };
  await createTaskFlowDataRequest(update_flow_param);
};

// 修改任务参数
const updateTask = async (result_name: string, result_value: string) => {
  if (result_name && result_value) {
    await updateFlowData();
    let result_config = {
      result_key: result_name,
      variable_key: result_value
    };
    let taskNode: TaskNodeType = {
      id: parseInt(nodeConfig.value.id),
      task_id: nodeConfig.value.task_id,
      process_id: process_id.value,
      result_config: result_config
    };
    let result: any = await updateTaskRequest(taskNode);
    if (result.code != 200) notice("任务配置修改失败");
  } else {
    console.log("任务配置修改失败");
  }
};
</script>
<script lang="ts">
export default {
  name: "TaskResultParam"
};
</script>

<style scoped></style>
