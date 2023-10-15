<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}流程实例`">
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
        <el-form-item label="流程id" prop="process_id">
          <el-input v-model="drawerProps.row!.process_id" clearable></el-input>
        </el-form-item>
      </template>
      <el-form-item label="流程名称" prop="process_name">
        <el-input v-model="drawerProps.row!.process_name" clearable></el-input>
      </el-form-item>
      <el-form-item label="触发方式" prop="run_type" clearable>
        <el-input v-model="drawerProps.row!.run_type" clearable></el-input>
      </el-form-item>
      <el-form-item label="流程状态" prop="process_status" clearable>
        <el-input v-model="drawerProps.row!.process_status" clearable></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="start_time" clearable>
        <el-input v-model="drawerProps.row!.start_time" clearable></el-input>
      </el-form-item>
      <el-form-item label="结束时间" prop="end_time" clearable>
        <el-input v-model="drawerProps.row!.end_time" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="ProcessDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getCurrentDate } from "@/utils/currentDateTime";

const rules = reactive({
  process_name: [{ required: true, message: "请填写流程名称" }],
  desc: [{ required: true, message: "请填写流程描述" }]
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
        drawerProps.value.row["end_time"] = getCurrentDate();
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}流程实例成功！` });
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
