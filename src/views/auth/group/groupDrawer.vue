<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}群组`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="群组名称" prop="group_name">
        <el-input v-model="drawerProps.row!.group_name" placeholder="请填写群组名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="群组描述" prop="desc">
        <el-input v-model="drawerProps.row!.desc" placeholder="请填群组描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="群组owner" prop="owner_id">
        <el-select v-model="drawerProps.row!.owner_id" placeholder="请选择群组owner" clearable>
          <el-option v-for="item in groupOwner" :key="item.value" :label="item.label" :value="item.value" />
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getCurrentDate } from "@/utils/currentDateTime";
import { getGroupOwner } from "@/api/auth/group/index";

let groupOwner = reactive<any>([]);
const rules = reactive({
  group_name: [{ required: true, message: "请填写群组名称" }],
  desc: [{ required: false, message: "请填写群组描述" }],
  owner_id: [{ required: false, message: "请选择群组owner" }]
});

onMounted(async () => {
  const data = await getGroupOwner();
  groupOwner = data.data;
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
const getOwnerName = (owner_id: number) => {
  let owner_name = "";
  groupOwner.forEach((item: { label: string; value: number }) => {
    if (item.value == owner_id) {
      owner_name = item.label;
    }
  });
  return owner_name;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 参数更新时间
      if (drawerProps.value.title === "编辑") drawerProps.value.row["update_time"] = getCurrentDate();

      if (drawerProps.value.row["owner_id"] && groupOwner)
        drawerProps.value.row["owner_name"] = getOwnerName(drawerProps.value.row["owner_id"]);

      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}群组成功！` });
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
