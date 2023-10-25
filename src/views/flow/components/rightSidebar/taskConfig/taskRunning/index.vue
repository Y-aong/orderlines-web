<template>
  <el-collapse-item title="任务运行配置" name="taskRunning">
    <el-table :data="defaultTaskConfig" style="width: 100%" max-height="65vh" stripe>
      <el-table-column prop="config_name" label="运行参数名" min-width="100" />
      <el-table-column prop="config_value" label="运行参数值" min-width="150">
        <template #default="scope">
          <el-select v-if="scope.row.config_name === 'notice_type'" v-model="defaultNoticeType" :disabled="isRunning">
            <el-option
              v-for="item in scope.row.config_value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="updateTask(scope.row.config_name, item.value)"
            />
          </el-select>
          <el-select
            v-if="scope.row.config_name === 'task_strategy'"
            v-model="defaultTaskStrategy"
            :disabled="isRunning"
          >
            >
            <el-option
              v-for="item in scope.row.config_value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @change="updateTask(scope.row.config_name, item.value)"
            />
          </el-select>
          <el-input
            v-model="scope.row.config_value"
            v-if="scope.row.config_name !== 'task_strategy' && scope.row.config_name !== 'notice_type'"
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
          <el-select v-if="scope.row.config_name === 'notice_type'" v-model="defaultNoticeType">
            <el-option
              v-for="item in scope.row.config_value"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-if="scope.row.config_name === 'task_strategy'" v-model="defaultTaskStrategy">
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
const defaultTaskStrategy = ref("报错");
const defaultNoticeType = ref("失败");
const { nodeConfig, defaultTaskConfig, process_id, isRunning } = storeToRefs(flowStore);
let dialogTableVisible = ref<boolean>(false);

const getTaskConfig = () => {
  dialogTableVisible.value = true;
};

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
  let task_config: any = {};
  task_config[config_name] = config_value;
  let taskNode: any = {
    id: nodeConfig.value.id,
    task_id: nodeConfig.value.task_id,
    process_id: process_id.value,
    task_config: task_config
  };
  let result: any = await updateTaskRequest(taskNode);
  if (result.code != 200) ElMessage.error("任务配置修改失败");
};
</script>
<script lang="ts">
export default {
  name: "TaskRunningConfig"
};
</script>

<style scoped></style>
