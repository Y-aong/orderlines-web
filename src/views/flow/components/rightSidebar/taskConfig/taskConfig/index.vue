<template>
  <el-collapse-item title="任务运行配置" name="taskRunning">
    <el-table :data="defaultTaskConfig" style="width: 100%" max-height="65vh" stripe>
      <el-table-column prop="config_label" label="运行参数名" min-width="100" />
      <el-table-column prop="config_value" label="运行参数值" min-width="150">
        <template #default="scope">
          <el-select
            v-if="scope.row.config_name === 'notice_type'"
            v-model="scope.row.config_value"
            :disabled="isRunning"
            placeholder="请选择通知方式"
            @change="updateTaskNoticeType"
          >
            <el-option v-for="item in NoticeTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select
            v-if="scope.row.config_name === 'task_strategy'"
            v-model="scope.row.config_value"
            :disabled="isRunning"
            placeholder="请选择通知方式"
            @change="updateTaskStrategy"
          >
            >
            <el-option v-for="item in TaskStrategy" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-switch
            v-if="scope.row.config_name === 'is_corner'"
            v-model="scope.row.config_value"
            width="40"
            @click="updateTask(scope.row.config_name, scope.row.config_value)"
          />
          <el-switch
            v-if="scope.row.config_name === 'is_state'"
            v-model="scope.row.config_value"
            width="40"
            @click="updateTask(scope.row.config_name, scope.row.config_value)"
          />
          <el-input
            v-model="scope.row.config_value"
            v-if="
              scope.row.config_name !== 'task_strategy' &&
              scope.row.config_name !== 'notice_type' &&
              scope.row.config_name !== 'is_corner' &&
              scope.row.config_name !== 'is_state'
            "
            @blur="updateTask(scope.row.config_name, scope.row.config_value)"
            :disabled="isRunning"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-button style="width: 100%" type="primary" @click="getTaskConfig"> 查看任务配置 </el-button>
  </el-collapse-item>

  <el-dialog v-model="dialogTableVisible" title="返回值说明">
    <el-table :data="defaultTaskConfig" style="width: 100%" border>
      <el-table-column prop="config_name" label="任务配置名称" min-width="150" />
      <el-table-column prop="config_value" label="任务运行配置" min-width="150">
        <template #default="scope">
          <el-select v-if="scope.row.config_name === 'notice_type'" v-model="scope.row.config_value">
            <el-option
              v-for="item in scope.row.config_value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="scope.row.config_name === 'task_strategy'" v-model="scope.row.config_value">
            <el-option
              v-for="item in scope.row.config_value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述信息" min-width="150" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts" name="TaskRunning">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { createGraphNodeRequest } from "@/api/flow/flowData/index";
import { FlowNode } from "@/api/flow/flowData/type";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { ElMessage } from "element-plus";
import useFlowStatueStore from "@/stores/modules/flowStatue";
import { BaseData, BaseResponse } from "@/api/interface/index";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";

const { isRunning } = storeToRefs(useFlowStatueStore());
const flowStore = useFlowStore();
const { nodeConfig, process_id, defaultTaskConfig } = storeToRefs(flowStore);
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());
let dialogTableVisible = ref<boolean>(false);

const getTaskConfig = async () => {
  dialogTableVisible.value = true;
};
const TaskStrategy = [
  { label: "报错", value: "RAISE" },
  { label: "重试", value: "RETRY" },
  { label: "忽略", value: "SKIP" }
];
const NoticeTypes = [
  { label: "失败", value: "FAILURE" },
  { label: "成功", value: "SUCCESS" },
  { label: "重试", value: "RETRY" },
  { label: "忽略", value: "SKIP" }
];

// 修改流程图和节点数据
const updateGraphNodeData = async (task_id: string) => {
  const graph_node_data: FlowNode.GraphNode = {
    process_id: process_id.value,
    task_id: task_id,
    defaultTaskConfig: defaultTaskConfig.value
  };
  await createGraphNodeRequest(graph_node_data);
};

// 修改数据库数据
const updateTask = async (config_name: string, config_value: string) => {
  // 修改数据库节点数据
  defaultTaskConfig.value.forEach(function (ele: any) {
    if (ele.config_name === config_name) {
      ele.config_value = config_value;
    }
  });
  let taskNode: Task.TaskItem = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: defaultTaskConfig.value,
    updater_name: userInfo.value.login_value
  };
  // 修改流程图和节点
  await updateGraphNodeData(nodeConfig.value.task_id);
  let result: BaseResponse<BaseData> = await updateTaskRequest(taskNode);
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};

// 修改消息通知
const updateTaskNoticeType = async (value: string) => {
  let task_config: any = defaultTaskConfig.value;

  task_config.forEach(function (ele: any) {
    if (ele.config_name === "notice_type") {
      ele.config_value = value;
    }
  });
  let taskNode: Task.TaskItem = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: task_config,
    updater_name: userInfo.value.login_value
  };

  await updateGraphNodeData(nodeConfig.value.task_id);
  let result: BaseResponse<BaseData> = await updateTaskRequest(taskNode);
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};
// 修改任务异常处理策略
const updateTaskStrategy = async (value: string) => {
  defaultTaskConfig.value.forEach(function (ele: any) {
    console.log("ele", ele);
    if (ele.config_name === "task_strategy") {
      ele.config_value = value;
    }
  });
  let taskNode: Task.TaskItem = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: defaultTaskConfig.value,
    updater_name: userInfo.value.login_value
  };

  let result: BaseResponse<BaseData> = await updateTaskRequest(taskNode);
  await updateGraphNodeData(nodeConfig.value.task_id);
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};
</script>

<style scoped></style>
