<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}权限`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写权限名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="权限描述" prop="desc">
        <el-input v-model="drawerProps.row!.desc" placeholder="请填权限描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-select v-model="drawerProps.row!.method" placeholder="请选择请求方法" clearable>
          <el-option v-for="item in requestMethod" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求路径" prop="path">
        <el-input v-model="drawerProps.row!.path" placeholder="请填请求路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否菜单" prop="menu">
        <el-select v-model="drawerProps.row!.menu" placeholder="请选择是否为菜单" clearable>
          <el-option v-for="item in isMenuType" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="permissionDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getCurrentDate } from "@/utils/currentDateTime";

type menuItem = {
  label: string;
  value: boolean;
};

const isMenuType: menuItem[] = [
  { label: "菜单", value: true },
  { label: "非菜单", value: false }
];
const requestMethod = [
  { label: "查询", value: "GET" },
  { label: "创建", value: "POST" },
  { label: "更新", value: "PUT" },
  { label: "删除", value: "DELETE" }
];

const rules = reactive({
  name: [{ required: true, message: "请填写权限名称" }],
  desc: [{ required: true, message: "请填写权限描述" }],
  method: [{ required: true, message: "请填写请求方法" }],
  path: [{ required: true, message: "请填写请求路径" }],
  menu: [{ required: false, message: "请选择是否为菜单" }]
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
      }

      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}权限成功！` });
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
