<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}变量实例`">
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
      <el-form-item label="配置名称" prop="config_name">
        <el-input v-model="drawerProps.row!.config_name" placeholder="请填写配置名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="配置值" prop="config_value">
        <el-input v-model="drawerProps.row!.config_value" placeholder="请填写配置值" clearable></el-input>
      </el-form-item>
      <el-form-item label="配置描述" prop="desc">
        <el-input v-model="drawerProps.row!.desc" placeholder="请填写配置描述" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="systemSettingDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { v4 as uuid4 } from "uuid";

const rules = reactive({
  config_name: [{ required: true, message: "填写配置名称" }],
  config_value: [{ required: true, message: "填写配置值" }],
  desc: [{ required: true, message: "填写配置描述" }]
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
      if (!drawerProps.value.row.process_id) {
        drawerProps.value.row["process_id"] = uuid4();
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
