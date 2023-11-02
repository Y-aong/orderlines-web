<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}告警`">
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
      <el-form-item label="流程名称" prop="process_name">
        <el-input v-model="drawerProps.row!.process_name" placeholder="请填写流程名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="流程实例ID" prop="process_instance_id">
        <el-input v-model="drawerProps.row!.process_instance_id" placeholder="请填写流程实例ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="task_name" clearable>
        <el-input v-model="drawerProps.row!.task_name" placeholder="请填写任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务id" prop="task_id" clearable>
        <el-input v-model="drawerProps.row!.task_id" placeholder="请填写任务id" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否确认" prop="people_confirm" clearable>
        <el-input v-model="drawerProps.row!.people_confirm" placeholder="是否确认" clearable></el-input>
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

const rules = reactive({
  process_name: [{ required: false, message: "流程名称" }],
  process_instance_id: [{ required: false, message: "流程实例ID" }],
  task_name: [{ required: false, message: "任务名称" }],
  task_id: [{ required: false, message: "任务id" }],
  people_confirm: [{ required: true, message: "是否确认" }]
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
      if (!drawerProps.value.row.node_type) drawerProps.value.row.node_type = "function-node";
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}流程成功！` });
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
