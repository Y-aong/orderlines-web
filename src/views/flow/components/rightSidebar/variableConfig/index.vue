<template>
  <el-card>
    <div :class="{ task_running_variable: isRunning, task_config_variable: !isRunning }">
      <h3>{{ !isRunning ? "任务变量配置" : "变量实例查看" }}</h3>
      <el-table :data="variableData" style="width: 100%">
        <el-table-column fixed prop="variable_key" label="变量名" min-width="110" />
        <el-table-column prop="variable_value" label="变量值" min-width="130" />
        <el-table-column prop="variable_type" label="类型" min-width="50" />
        <el-table-column fixed="right" label="action" min-width="120" align="center">
          <template #default="scope">
            <el-button type="success" size="small" @click.prevent="getVariableDetail(scope.row)" circle icon="View" />
            <el-button
              type="warning"
              size="small"
              :disabled="isRunning"
              @click.prevent="updateVariable(scope.row)"
              circle
              icon="Edit"
            />
            <el-button
              type="danger"
              size="small"
              :disabled="isRunning"
              @click.prevent="deleteVariable(scope.row.id)"
              circle
              icon="Delete"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button style="width: 100%" type="primary" @click="createVariable" v-if="!isRunning"> 增加变量 </el-button>
    </div>
  </el-card>

  <el-dialog
    v-model="dialogFormVisible"
    :title="VariableItem.id && VariableItem.id !== 0 ? '变量配置修改' : '变量配置创建'"
  >
    <el-form style="width: 80%" :model="VariableItem" ref="formRef" label-width="120px" :hide-required-asterisk="true">
      <el-form-item label="变量名称：" prop="variable_key">
        <el-input placeholder="请输入变量名称，支持中文" v-model="VariableItem.variable_key"> </el-input>
      </el-form-item>
      <el-form-item label="变量数值：" prop="variable_value">
        <el-input placeholder="请输入变量值，可为空" v-model="VariableItem.variable_value"> </el-input>
      </el-form-item>
      <el-form-item label="变量类型：" prop="variable_type">
        <el-select v-model="VariableItem.variable_type" placeholder="请选择变量类型" :disabled="isRunning">
          <el-option v-for="item in variableTypeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="变量描述：" prop="desc">
        <el-input placeholder="请输入变量描述" v-model="VariableItem.variable_desc" type="textarea"> </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="cancel"> 取消 </el-button>
      <el-button type="primary" size="default" @click="confirm"> 确定 </el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="detailVisible" :title="isRunning ? '查看变量实例详情' : '查看流程变量详情'">
    <el-table :data="variableDetail" style="width: 100%" height="240" border>
      <el-table-column fixed prop="variable_key" label="变量名" min-width="100" align="center" />
      <el-table-column prop="variable_value" label="变量值" min-width="240" align="center" />
      <el-table-column prop="variable_type" label="变量类型" min-width="120" align="center" />
      <el-table-column prop="variable_desc" label="变量描述" min-width="120" align="center" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts" name="VariableConfig">
import { reactive, ref, onMounted } from "vue";
import {
  createVariableRequest,
  deleteVariableRequest,
  getVariableDetailRequest,
  updateVariableRequest,
  getVariableInstanceDetailRequest
} from "@/api/orderlines/orderlinesManager/variable/index";
import { getVariableRequest, getVariableInstanceRequest } from "@/api/flow/variable/index";
import { FlowVariable } from "@/api/flow/variable/type";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { Variable } from "@/api/orderlines/orderlinesManager/variable/type";
import useFlowStatueStore from "@/stores/modules/flowStatue";
import { BaseData, BaseResponse, DeleteData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());
let dialogFormVisible = ref<boolean>(false);
let detailVisible = ref<boolean>(false);
let VariableItem = reactive<Variable.VariableItem>({
  variable_key: "",
  variable_value: "",
  variable_type: "",
  variable_desc: ""
});

const { isRunning } = storeToRefs(useFlowStatueStore());
const { process_id, process_name, process_instance_id } = storeToRefs(useFlowStore());
const variableTypeOption = [
  {
    value: "str",
    label: "字符"
  },
  {
    value: "int",
    label: "数字"
  },
  {
    value: "float",
    label: "小数"
  },
  {
    value: "list",
    label: "列表"
  },
  {
    value: "dict",
    label: "字典"
  }
];

onMounted(async () => {
  await getVariable();
});

const variableData = ref();
let variableDetail = ref<Variable.VariableItem[]>();

const getVariable = async () => {
  if (isRunning.value) {
    let response: BaseResponse<FlowVariable.VariableItem[]> = await getVariableRequest(process_id.value);
    if (response.code == 200) variableData.value = response.data;
  } else if (process_instance_id.value) {
    let response: BaseResponse<Variable.VariableItem[]> = await getVariableInstanceRequest(process_instance_id.value);
    if (response.code == 200) variableData.value = response.data;
  }
};
const createVariable = async () => {
  VariableItem.variable_key = "";
  VariableItem.variable_type = "";
  VariableItem.variable_desc = "";
  dialogFormVisible.value = false;
  dialogFormVisible.value = true;
};

const updateVariable = async (row: Variable.VariableItem) => {
  VariableItem.id = row.id;
  VariableItem.process_id = row.process_id;
  VariableItem.process_name = row.process_name;
  VariableItem.variable_key = row.variable_key;
  VariableItem.variable_value = row.variable_value;
  VariableItem.variable_type = row.variable_type;
  VariableItem.variable_desc = row.variable_desc;
  dialogFormVisible.value = true;
};

// 获取变量详情
const getVariableDetail = async (row: any) => {
  detailVisible.value = true;
  if (isRunning.value) {
    let response: BaseResponse<Variable.VariableItem> = await getVariableInstanceDetailRequest(
      process_instance_id.value,
      row.variable_key
    );
    if (response.code === 200) variableDetail.value = [response.data];
  } else {
    let variable_response: BaseResponse<Variable.VariableItem> = await getVariableDetailRequest(row.id);
    if (variable_response.code === 200) variableDetail.value = [variable_response.data];
  }
};
// 删除流程变量
const deleteVariable = async (id: number) => {
  let res: BaseResponse<DeleteData> = await deleteVariableRequest(id);
  if (res.code == 200) {
    ElMessage.success("删除变量完成");
  } else {
    ElMessage.error("删除变量失败");
  }
  await getVariable();
};

//对话框底部取消按钮
const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false;
};

// 变量配置确认按钮
const confirm = async () => {
  if (!VariableItem.variable_key || !VariableItem.variable_type) {
    ElMessage.error("请设置流程参数");
    return;
  }

  if (VariableItem.id && VariableItem.id !== 0) {
    // 修改变量
    let variableItem = {
      id: VariableItem.id,
      process_id: process_id.value,
      process_name: process_name.value,
      variable_key: VariableItem.variable_key,
      variable_value: VariableItem.variable_value,
      variable_type: VariableItem.variable_type,
      variable_desc: VariableItem.variable_desc,
      updater_name: userInfo.value.login_value
    };
    let result: BaseResponse<BaseData> = await updateVariableRequest(variableItem as Variable.VariableItem);
    if (result.code !== 200) {
      ElMessage.error("修改变量失败");
    } else {
      ElMessage.success("修改变量成功");
      VariableItem.id = 0;
    }
  } else {
    // 创建变量
    let variableItem = {
      process_id: process_id.value,
      process_name: process_name.value,
      variable_key: VariableItem.variable_key,
      variable_value: VariableItem.variable_value,
      variable_type: VariableItem.variable_type,
      variable_desc: VariableItem.variable_desc,
      creator_name: userInfo.value.login_value
    };
    let result: BaseResponse<BaseData> = await createVariableRequest(variableItem as Variable.VariableItem);
    if (result.code !== 200) {
      ElMessage.error("创建变量失败");
    } else {
      ElMessage.success("创建变量成功");
    }
  }
  VariableItem.variable_key = "";
  VariableItem.variable_value = "";
  VariableItem.variable_type = "str";
  VariableItem.variable_desc = "";
  dialogFormVisible.value = false;
  await getVariable();
};
</script>

<style scoped>
.task_config_variable {
  width: 100%;
  height: 100vh;
  background: #ffffff;
}
.task_running_variable {
  width: 100%;
  height: 75vh;
  background: #ffffff;
}
</style>
