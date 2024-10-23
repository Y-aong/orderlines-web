<template>
  <div>
    <el-table :data="nodeParam" max-height="65vh" stripe show-header style="width: 100%">
      <el-table-column fixed prop="desc" label="参数名" min-width="80" />
      <el-table-column prop="desc" label="参数值" min-width="240" required>
        <template #default="scope">
          <el-select
            v-model="scope.row.value"
            placeholder="请选择子流程名称"
            @blur="selectSubProcessId(scope.row)"
            v-if="scope.row.name === 'sub_process_id'"
          >
            <el-option v-for="item in subProcessOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button v-if="scope.row.name === 'sub_process_params'" @click="getParamType(scope.row)">
            点击设置参数
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 子流程参数输入框  -->

    <!-- 子流程参数修改框 -->
    <el-dialog title="输入参数——请点击修改" v-model="deliveryForm.delivery">
      <el-table :data="variables" style="width: 100%" max-height="200vh" @cell-click="handleCellClick" border>
        <el-table-column prop="variable_key" label="变量名称" width="180">
          <template #default="{ row }">
            <span v-if="!isEditing[row.process_id]">{{ row.variable_key }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="variable_value" label="变量值" width="180">
          <template #default="{ row }">
            <span v-if="!isEditing[row.process_id]">{{ row.variable_value }}</span>
            <el-input v-else v-model="row.variable_value" @blur="handleEdit(row, 'variable_value')" />
          </template>
        </el-table-column>
        <el-table-column prop="variable_type" label="变量类型" width="120" align="center">
          <template #default="{ row }">
            <span v-if="!isEditing[row.process_id]">{{ row.variable_type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="variable_desc" label="变量描述">
          <template #default="{ row }">
            <span v-if="!isEditing[row.process_id]">{{ row.variable_desc }}</span>
            <el-input v-else v-model="row.variable_desc" @blur="handleEdit(row, 'variable_desc')" />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deliveryForm.delivery = !deliveryForm.delivery"> 取消 </el-button>
          <el-button type="primary" @click="updateTask"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="SubProcess">
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { ElMessage } from "element-plus";
import { getSubProcess, updateSubProcess } from "@/api/flow/flowOperator/index";
import { FlowOperator } from "@/api/flow/flowOperator/type";
import { getSubProcessOptionRequest } from "@/api/option/index";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { createGraphNodeRequest } from "@/api/flow/flowData/index";
import { FlowNode } from "@/api/flow/flowData/type";
import { Option } from "@/api/option/type";
import { BaseResponse } from "@/api/interface/index";
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());
// 标记是否是编辑状态
const isEditing = ref<any>({});
// 子流程ID
const subProcessId = ref<string>("");
// 子流程参数选项
const subProcessOption = ref<Option.OptionItem[]>([]);
// 设置点击修改
const deliveryForm = reactive({ delivery: false });
const variables = ref<FlowOperator.SubprocessParmaType[]>();
const { process_id, nodeConfig, nodeParam } = storeToRefs(useFlowStore());

onMounted(async () => {
  await getSubProcessOption();
});

// 获取子流程参数选项
const getSubProcessOption = async () => {
  const response: BaseResponse<Option.OptionResponse> = await getSubProcessOptionRequest(process_id.value);
  subProcessOption.value = Array.isArray(response.data) ? response.data : [];
};

// 选择子流程ID
const selectSubProcessId = async (row: any) => {
  if (!row.value) {
    ElMessage.error("请选择子流程名称");
    return;
  }
  subProcessId.value = row.value;
  await updateTask();
  await updateFlowData();
};

// 处理单元格点击事件
const handleCellClick = (row: any, column: any) => {
  if (["variable_key", "variable_value", "variable_type", "variable_desc"].includes(column.property)) {
    isEditing.value[row.process_id] = true;
  }
};

// 处理单元格修改事件
const handleEdit = async (row: any, property: string) => {
  delete isEditing.value[row.process_id];
  // 修改子流程参数
  await updateSubProcess(row);
  // 获取子流程参数
  let response = await getSubProcess(row.process_id);
  variables.value = response.data;
  await updateTask();
  // 修改子流程任务参数
  ElMessage.success(`更新成功: ${property} 的新值为 ${row[property]}`);
  deliveryForm.delivery = !deliveryForm.delivery;
};

// 修改任务参数
const updateTask = async () => {
  let method_kwargs: any = {
    sub_process_id: subProcessId.value,
    sub_process_params: variables.value
  };
  let taskNode: Task.TaskItem = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    method_kwargs: method_kwargs,
    updater_name: userInfo.value.login_value
  };
  let updateTaskResponse = await updateTaskRequest(taskNode);
  if (updateTaskResponse.code != 200) ElMessage.error("更新失败");
  await updateFlowData();
};

// 获取参数类型
const getParamType = async (row: any) => {
  if (!subProcessId.value && !row.value) {
    ElMessage.error("请选择子流程名称");
    return;
  }
  if (subProcessId.value) {
    const response = await getSubProcess(subProcessId.value);
    variables.value = response.data;
    row.value = response.data;
  } else {
    variables.value = row.value;
  }

  deliveryForm.delivery = !deliveryForm.delivery;
};

// 修改流程图数据
const updateFlowData = async () => {
  const graph_node: FlowNode.GraphNode = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeParam: nodeParam.value
  };
  await createGraphNodeRequest(graph_node);
};
</script>

<style scoped>
.tooltip-base-box .center {
  justify-content: center;
}
</style>
