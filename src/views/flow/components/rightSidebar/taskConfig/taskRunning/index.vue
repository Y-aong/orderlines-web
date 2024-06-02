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

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { createFlowDataRequest } from "@/api/flow/taskNode/index";
import { updateTaskRequest } from "@/api/orderlines/task/index";
import { ElMessage } from "element-plus";

const flowStore = useFlowStore();

const { nodeConfig, process_id, isRunning, defaultTaskConfig } = storeToRefs(flowStore);
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

// 修改流程图数据
const updateFlowData = async () => {
  const update_flow_task_default_config = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    defaultTaskConfig: defaultTaskConfig.value
  };
  await createFlowDataRequest(update_flow_task_default_config);
};

// 修改数据库数据
const updateTask = async (config_name: string, config_value: string) => {
  // 修改流程图节点
  await updateFlowData();
  // 修改数据库节点数据
  defaultTaskConfig.value.forEach(function (ele: any) {
    if (ele.config_name === config_name) {
      ele.config_value = config_value;
    }
  });
  let taskNode: any = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: defaultTaskConfig.value
  };
  let result: any = await updateTaskRequest(taskNode);
  await updateFlowData();
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
  let taskNode: any = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: task_config
  };

  await updateFlowData();
  let result: any = await updateTaskRequest(taskNode);
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};
// 修改任务异常处理策略
const updateTaskStrategy = async (value: string) => {
  defaultTaskConfig.value.forEach(function (ele: any) {
    if (ele.config_name === "task_strategy") {
      ele.config_value = value;
    }
  });
  let taskNode: any = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: defaultTaskConfig.value
  };

  let result: any = await updateTaskRequest(taskNode);
  await updateFlowData();
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};
</script>
<script lang="ts">
export default {
  name: "TaskRunningConfig"
};
</script>

<style scoped></style>
