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
      <el-form-item label="告警接收人" prop="notice_id">
        <el-select v-model="drawerProps.row!.notice_id" placeholder="请选择告警接收人" style="width: 240px">
          <el-option v-for="item in userNameOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警接收组" prop="notice_group_name">
        <el-input v-model="drawerProps.row!.notice_group_name" placeholder="请填写告警接收组" clearable></el-input>
      </el-form-item>
      <el-form-item label="接收组ID" prop="notice_group_id">
        <el-input v-model="drawerProps.row!.notice_group_id" placeholder="请填写告警接收组ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="通知方式" prop="notice_type" clearable>
        <el-select v-model="drawerProps.row!.notice_type" placeholder="请选择告警通知类型" style="width: 240px">
          <el-option v-for="item in noticeTypeOption" :key="item.value" :label="item.label" :value="item.value" />
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getUserNameOptRequest } from "@/api/option/index";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";

const { userInfo } = storeToRefs(useUserStore());
const userNameOptions = ref<any>([]);

onMounted(async () => {
  const userResponse = await getUserNameOptRequest();
  userNameOptions.value = userResponse.data;
});

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const rules = reactive({
  notice_name: [{ required: true, message: "告警接收人" }],
  notice_id: [{ required: true, message: "告警接收人ID" }],
  notice_group_id: [{ required: true, message: "告警接收组ID" }],
  notice_group_name: [{ required: true, message: "告警接收组" }],
  notice_type: [{ required: true, message: "告警通知类型" }]
});
const noticeTypeOption = [
  { label: "邮件", value: "email" },
  { label: "手机", value: "phone" },
  { label: "钉钉", value: "dingDing" }
];

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
    if (drawerProps.value.title === "编辑") {
      drawerProps.value.row.updater_name = userInfo.value.login_value;
    } else {
      drawerProps.value.row.creator_name = userInfo.value.login_value;
    }
    if (!valid) return;
    try {
      if (!drawerProps.value.row.notice_name) {
        userNameOptions.value.forEach(element => {
          if (element.value === drawerProps.value.row.notice_id) {
            drawerProps.value.row.notice_name = element.label;
          }
        });
      }
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}告警通知成功！` });
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
