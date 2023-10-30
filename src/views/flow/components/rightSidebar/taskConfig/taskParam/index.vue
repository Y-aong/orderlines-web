<template>
  <el-collapse-item title="任务参数配置" name="taskParams">
    {{ nodeConfig.task_type }}
    <template v-if="nodeConfig.task_type === 'process_control'">
      <ProcessControl />
    </template>
    <template v-if="nodeConfig.task_type === 'group'">
      <TaskGroup />
    </template>

    <template v-if="nodeConfig.task_type === 'common'">
      <el-table :data="nodeParam" max-height="65vh" stripe show-header style="width: 100%">
        <el-table-column fixed prop="desc" label="参数名" min-width="80" />
        <el-table-column prop="desc" label="参数值" min-width="240">
          <template #default="scope">
            <el-select
              v-model="scope.row.value"
              :placeholder="`类型${scope.row.type}，下拉框使用变量`"
              filterable
              allow-create
              @change="updateTask(scope.row)"
              @clear="clearFlag = true"
              @focus="clearFlag = false"
              @click="getVariableOption"
              :disabled="isRunning"
              style="width: 280px"
            >
              <el-option v-for="(item, index) in variableOption" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-4" style="width: 100%" type="primary" @click="cancel"> 查看变量 </el-button>
    </template>
  </el-collapse-item>
  <el-dialog v-model="dialogTableVisible" :title="`${nodeConfig.task_name}——参数说明`">
    <el-table :data="nodeParam" style="width: 100%" border>
      <el-table-column prop="name" label="参数名称" min-width="150" />
      <el-table-column prop="value" label="参数值" min-width="150" />
      <el-table-column prop="default" label="默认值" min-width="120" />
      <el-table-column prop="desc" label="描述信息" min-width="150" />
      <el-table-column prop="required" label="是否必填" min-width="150" />
      <el-table-column prop="type" label="参数类型" min-width="150" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import ProcessControl from "./processControl/index.vue";
import TaskGroup from "./taskGroup/index.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { updateTaskRequest } from "@/api/orderlines/task/index";
import { getVariableOptionRequest } from "@/api/flow/variable/index";
import { createTaskFlowDataRequest } from "@/api/flow/taskNode/index";
import { ElNotification } from "element-plus";
import { ElMessage } from "element-plus";
import { Task } from "@/api/orderlines/task/type";
import { FlowVariable } from "@/api/flow/variable/type";

const { nodeParam, nodeConfig, process_id, isRunning } = storeToRefs(useFlowStore());
let dialogTableVisible = ref<boolean>(false);
let variableOption = ref<FlowVariable.VariableOption[]>([{ label: "", value: "" }]);
let clearFlag = ref<boolean>(false);

interface ParamItem {
  default: undefined | string;
  desc: string;
  name: string;
  required: boolean;
  title: string;
  type: string;
  value?: string;
}

const cancel = () => {
  dialogTableVisible.value = true;
};

const getVariableOption = async () => {
  const result: any = await getVariableOptionRequest(process_id.value);
  console.log("获取变量选项:", result);
  variableOption.value = result.data;
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

// 修改任务参数
const updateTask = async (row: ParamItem) => {
  console.log("修改任务参数", clearFlag.value, row, row.value, row.name);
  if (clearFlag.value) return;
  if (row.value) {
    let param_name = row.name;
    let param_value = await checkParam(row);
    if (param_value) {
      let method_kwargs: any = {};
      method_kwargs[param_name] = param_value;
      let taskNode: Task.TaskItem = {
        id: nodeConfig.value.id,
        process_id: process_id.value,
        method_kwargs: method_kwargs
      };
      let result: any = await updateTaskRequest(taskNode);
      if (result.code !== 200) ElMessage.error("任务配置修改失败");
      await updateFlowData();
    }
  } else {
    ElMessage.error("修改任务参数失败参数值为空");
  }
};

// 生成表单校验规则
const checkParam = (row: any) => {
  let param_type: string = row.type;
  let param_value: string = row.value;
  // 使用变量
  if (param_value.startsWith("${") && param_value.endsWith("}")) return param_value;
  // 使用普通输入
  if (param_type.search("str") !== -1 && param_type.search("class") !== -1) {
    return param_value;
  } else if (param_type.search("int") !== -1 && param_type.search("class") !== -1) {
    if (!isNaN(parseInt(param_value))) {
      return parseInt(param_value);
    } else {
      ElNotification({
        type: "error",
        title: "参数类型异常",
        message: `参数类型规定为${param_type}`
      });
    }
  } else if (param_type.search("dict") !== -1 && param_type.search("class") !== -1) {
    try {
      return JSON.parse(param_value);
    } catch (e) {
      ElNotification({
        type: "error",
        title: "参数类型异常",
        message: `参数类型规定为${param_type}`
      });
    }
  } else if (param_type.search("list") !== -1 && param_type.search("class") !== -1) {
    try {
      return JSON.parse(param_value);
    } catch (e) {
      ElNotification({
        type: "error",
        title: "参数类型异常",
        message: `参数类型规定为${param_type}`
      });
    }
  } else if (param_type.search("float") !== -1 && param_type.search("class") !== -1) {
    if (!isNaN(parseFloat(param_value))) {
      return parseFloat(param_value);
    } else {
      ElNotification({
        type: "error",
        title: "参数类型异常",
        message: `参数类型规定为${param_type}`
      });
    }
  } else {
    return param_value;
  }
};
</script>
<script lang="ts">
export default {
  name: "TaskParam"
};
</script>

<style scoped></style>
