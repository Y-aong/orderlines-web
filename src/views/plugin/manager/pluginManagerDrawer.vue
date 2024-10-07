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
      <el-form-item label="插件模块" prop="model_name">
        <el-input v-model="drawerProps.row!.model_name" placeholder="请填写插件模块" clearable></el-input>
      </el-form-item>
      <el-form-item label="插件文件" prop="file_name">
        <el-input v-model="drawerProps.row!.file_name" placeholder="请填写插件文件" clearable></el-input>
      </el-form-item>

      <el-form-item label="插件描述" prop="desc" clearable>
        <el-input v-model="drawerProps.row!.desc" placeholder="请填写插件描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="enable" clearable>
        <el-select v-model="drawerProps.row!.enable" placeholder="请选择是否禁用" clearable>
          <el-option v-for="item in enableOptions" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
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

const enableOptions = [
  { label: "禁用", value: true },
  { label: "启用", value: false }
];

const rules = reactive({
  model_name: [{ required: true, message: "请填写插件模块" }],
  file_name: [{ required: true, message: "请填写插件文件" }],
  desc: [{ required: false, message: "请填写插件描述" }],
  enable: [{ required: false, message: "请选择是否禁用" }]
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
