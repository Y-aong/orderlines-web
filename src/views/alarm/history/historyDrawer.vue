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
      <el-form-item label="告警组名称" prop="group_name">
        <el-input v-model="drawerProps.row!.group_name" placeholder="告警组名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="job_name">
        <el-input v-model="drawerProps.row!.job_name" placeholder="请填写任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="实例名称" prop="instance_name" clearable>
        <el-input v-model="drawerProps.row!.instance_name" placeholder="请填写实例名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务状态" prop="job_status" clearable>
        <el-input v-model="drawerProps.row!.job_status" placeholder="请填写任务状态" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否确认" prop="confirm" clearable>
        <el-input v-model="drawerProps.row!.confirm" placeholder="是否确认" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警开始时间" prop="alert_start_time" clearable>
        <el-input v-model="drawerProps.row!.alert_start_time" placeholder="告警开始时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警结束时间" prop="alert_end_time" clearable>
        <el-input v-model="drawerProps.row!.alert_end_time" placeholder="告警结束时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="持续时间" prop="duration_time" clearable>
        <el-input v-model="drawerProps.row!.duration_time" placeholder="持续时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警数据" prop="alert_data" clearable>
        <el-input v-model="drawerProps.row!.alert_data" placeholder="告警数据" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警注解" prop="annotations" clearable>
        <el-input v-model="drawerProps.row!.annotations" placeholder="告警注解" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认人" prop="handler_name" clearable>
        <el-input v-model="drawerProps.row!.handler_name" placeholder="确认人" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警备注" prop="alarm_remarks" clearable>
        <el-input v-model="drawerProps.row!.alarm_remarks" placeholder="告警备注" clearable></el-input>
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

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const rules = reactive({});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

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
      ElMessage.success({ message: `${drawerProps.value.title}告警确认成功！` });
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
