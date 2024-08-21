<template>
  <el-card>
    <div :class="{ task_running_variable: isRunning, task_config_variable: !isRunning }">
      <h3>任务变量配置</h3>
      <el-table :data="variableData" style="width: 100%">
        <el-table-column fixed prop="variable_key" label="变量名" min-width="110" />
        <el-table-column prop="variable_value" label="变量值" min-width="100" />
        <el-table-column prop="variable_type" label="类型" min-width="80" width="80" />
        <el-table-column fixed="right" label="action" min-width="120" align="center">
          <template #default="scope">
            <el-button type="success" size="small" @click.prevent="getVariableDetail(scope.row)" circle icon="View" />
            <el-button type="warning" size="small" @click.prevent="updateVariable(scope.row)" circle icon="Edit" />
            <el-button type="danger" size="small" @click.prevent="deleteVariable(scope.row.id)" circle icon="Delete" />
          </template>
        </el-table-column>
      </el-table>
      <el-button style="width: 100%" type="primary" @click="createVariable"> 增加变量 </el-button>
    </div>
  </el-card>

  <el-dialog v-model="dialogFormVisible" :title="VariableItem.id ? '插件配置修改' : '插件配置创建'">
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

  <el-dialog v-model="detailVisible" title="查看流程变量详情">
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
import { getVariableRequest } from "@/api/flow/variable/index";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { Variable } from "@/api/orderlines/orderlinesManager/variable/type";

let { process_id, process_name, process_instance_id, isRunning } = storeToRefs(useFlowStore());

let dialogFormVisible = ref<boolean>(false);
let detailVisible = ref<boolean>(false);
let VariableItem = reactive<Variable.VariableItem>({
  variable_key: "",
  variable_value: "",
  variable_type: "",
  variable_desc: ""
});
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
    value: "bool",
    label: "bool"
  },
  {
    value: "None",
    label: "None"
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
let variableDetail = ref<any>();

const getVariable = async () => {
  let res: any = await getVariableRequest(process_id.value);
  if (res.code == 200) {
    variableData.value = res.data;
  }
};
const createVariable = async () => {
  VariableItem.variable_key = "";
  VariableItem.variable_type = "";
  VariableItem.variable_desc = "";
  dialogFormVisible.value = false;
  dialogFormVisible.value = true;
};
const updateVariable = async (row: any) => {
  VariableItem.id = row.id;
  VariableItem.process_id = row.process_id;
  VariableItem.process_name = row.process_name;
  VariableItem.variable_key = row.variable_key;
  VariableItem.variable_value = row.variable_value;
  VariableItem.variable_type = row.variable_type;
  VariableItem.variable_desc = row.variable_desc;
  dialogFormVisible.value = true;
};
const getVariableDetail = async (row: any) => {
  detailVisible.value = true;
  if (isRunning.value) {
    let res: any = await getVariableInstanceDetailRequest(process_instance_id.value, row.variable_key);
    if (res.code === 200) variableDetail.value = [res.data];
  } else {
    let res: any = await getVariableDetailRequest(row.id);
    console.log(res.data);

    if (res.code === 200) variableDetail.value = [res.data];
  }
};

const deleteVariable = async (id: number) => {
  let res: any = await deleteVariableRequest(id);
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

const confirm = async () => {
  if (VariableItem.id) {
    // 修改变量
    let variableItem = {
      id: VariableItem.id,
      process_id: process_id.value,
      process_name: process_name.value,
      variable_key: VariableItem.variable_key,
      variable_value: VariableItem.variable_value,
      variable_type: VariableItem.variable_type,
      variable_desc: VariableItem.variable_desc
    };
    let result: any = await updateVariableRequest(variableItem as Variable.VariableItem);
    if (result.code !== 200) {
      ElMessage.error("修改变量失败");
    }
  } else {
    // 创建变量
    let variableItem = {
      process_id: process_id.value,
      process_name: process_name.value,
      variable_key: VariableItem.variable_key,
      variable_value: VariableItem.variable_value,
      variable_type: VariableItem.variable_type,
      variable_desc: VariableItem.variable_desc
    };
    let result: any = await createVariableRequest(variableItem as Variable.VariableItem);
    if (result.code !== 200) {
      ElMessage.error("创建变量失败");
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
