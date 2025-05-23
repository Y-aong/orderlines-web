<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}插件`">
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
      <el-form-item label="插件类名" prop="class_name">
        <el-input v-model="drawerProps.row!.class_name" placeholder="请填写插件类名" clearable></el-input>
      </el-form-item>
      <el-form-item label="插件版本" prop="version">
        <el-input v-model="drawerProps.row!.version" placeholder="请填写插件版本" clearable></el-input>
      </el-form-item>
      <el-form-item label="插件方法" prop="method_name" clearable>
        <el-input v-model="drawerProps.row!.method_name" placeholder="请填写插件方法" clearable></el-input>
      </el-form-item>
      <el-form-item label="插件描述" prop="method_desc" clearable>
        <el-input v-model="drawerProps.row!.method_desc" placeholder="请填写插件描述" clearable></el-input>
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
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";
import { getCurrentDate } from "@/utils/currentDateTime";

let { userInfo } = storeToRefs(useUserStore());

const rules = reactive({
  class_name: [{ required: true, message: "请填写插件类名" }],
  version: [{ required: true, message: "请填写插件版本" }],
  method_name: [{ required: true, message: "请填写插件方法" }],
  method_desc: [{ required: true, message: "请填写插件描述" }],
  node_type: [{ required: true, message: "请填写插件类型" }]
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
      if (drawerProps.value.title === "编辑") {
        drawerProps.value.row["update_time"] = getCurrentDate();
        drawerProps.value.row["updater_name"] = userInfo.value.login_value;
      } else {
        drawerProps.value.row["creator_name"] = userInfo.value.login_value;
      }
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
