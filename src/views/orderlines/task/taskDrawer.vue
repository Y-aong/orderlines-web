<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}任务`">
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
      <el-form-item label="任务名称" prop="task_name">
        <el-input v-model="drawerProps.row!.task_name" placeholder="请填写任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="desc" clearable>
        <el-input v-model="drawerProps.row!.desc" placeholder="请填写任务描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="方法名称" prop="method_name" clearable>
        <el-input v-model="drawerProps.row!.method_name" placeholder="请填写方法名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="task_type" clearable>
        <el-input v-model="drawerProps.row!.task_type" placeholder="请填写任务类型" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="TaskDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";
import { getCurrentDate } from "@/utils/currentDateTime";

let { userInfo } = storeToRefs(useUserStore());

const rules = reactive({
  process_id: [{ required: true, message: "请填写流程id" }],
  task_name: [{ required: true, message: "请填写任务名称" }],
  desc: [{ required: true, message: "请填写任务描述" }],
  method_name: [{ required: true, message: "请填写方法名称" }],
  task_type: [{ required: true, message: "请填写任务类型" }]
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
      for (const key in drawerProps.value.row) {
        if (key === "task_instance") delete drawerProps.value.row[key];
      }
      if (drawerProps.value.title === "新增") {
        drawerProps.value.row["update_time"] = getCurrentDate();
        drawerProps.value.row["updater_name"] = userInfo.value.login_value;
      } else {
        drawerProps.value.row["creator_name"] = userInfo.value.login_value;
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}任务成功！` });
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
