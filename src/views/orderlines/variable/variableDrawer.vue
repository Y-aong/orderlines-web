<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}变量`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <template v-if="drawerProps.title === '查看'">
        <el-form-item label="id" prop="id">
          <el-input v-model="drawerProps.row!.id" clearable></el-input>
        </el-form-item>
      </template>
      <el-form-item label="流程id" prop="process_id">
        <el-input v-model="drawerProps.row!.process_id" placeholder="请填写流程id" clearable></el-input>
      </el-form-item>
      <el-form-item label="流程名称" prop="process_name">
        <el-input v-model="drawerProps.row!.process_name" placeholder="请填写流程名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="变量名称" prop="variable_key">
        <el-input v-model="drawerProps.row!.variable_key" placeholder="请填写变量名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="变量值" prop="variable_value">
        <el-input v-model="drawerProps.row!.variable_value" placeholder="请填写变量值" clearable></el-input>
      </el-form-item>
      <el-form-item label="变量描述" prop="variable_desc" clearable>
        <el-input v-model="drawerProps.row!.variable_desc" placeholder="请填写变量描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="变量类型" prop="variable_type" clearable>
        <el-input v-model="drawerProps.row!.variable_type" placeholder="请填写变量类型" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否缓存" prop="is_cache" clearable>
        <el-input v-model="drawerProps.row!.task_config" placeholder="是否缓存" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="taskInstanceDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getCurrentDate } from "@/utils/currentDateTime";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";

let { userInfo } = storeToRefs(useUserStore());

const rules = reactive({
  process_id: [{ required: true, message: "填写流程id" }],
  process_name: [{ required: true, message: "填写流程名称" }],
  variable_key: [{ required: true, message: "填写变量名称" }],
  variable_value: [{ required: false, message: "填写变量值" }],
  variable_desc: [{ required: false, message: "填写变量描述" }],
  variable_type: [{ required: true, message: "填写变量类型" }],
  is_cache: [{ required: false, message: "选择是否缓存" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      if (drawerProps.value.title === "编辑") {
        drawerProps.value.row.update_time = getCurrentDate();
      }
      if (drawerProps.value.title === "编辑") {
        drawerProps.value.row["update_time"] = getCurrentDate();
        drawerProps.value.row["updater_name"] = userInfo.value.login_value;
      } else {
        drawerProps.value.row["creator_name"] = userInfo.value.login_value;
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}变量成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
