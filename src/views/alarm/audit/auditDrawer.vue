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
      <el-form-item label="告警名称" prop="alarm_name">
        <el-input v-model="drawerProps.row!.notice_group_name" placeholder="请填写告警名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警标签" prop="alarm_label" clearable>
        <el-input v-model="drawerProps.row!.alarm_label" placeholder="请填写告警标签" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警等级" prop="alarm_level">
        <el-input v-model="drawerProps.row!.alarm_level" placeholder="请填写告警等级" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警处理人" prop="handle_name">
        <el-input v-model="drawerProps.row!.handle_name" placeholder="请填写告警处理人" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警持续时间" prop="duration_time">
        <el-input v-model="drawerProps.row!.duration_time" placeholder="请填写告警持续时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警状态" prop="status">
        <el-input v-model="drawerProps.row!.status" placeholder="请填写告警状态" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警来源" prop="source">
        <el-input v-model="drawerProps.row!.source" placeholder="请填写告警来源" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="created_at">
        <el-input v-model="drawerProps.row!.created_at" placeholder="请填写告警创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updated_at">
        <el-input v-model="drawerProps.row!.updated_at" placeholder="请填写告警最后更新时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="相关链接" prop="link">
        <el-input v-model="drawerProps.row!.link" placeholder="请填写相关链接" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警备注" prop="comments">
        <el-input v-model="drawerProps.row!.comments" placeholder="请填写告警备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="软件版本" prop="version">
        <el-input v-model="drawerProps.row!.version" placeholder="请填写软件版本" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警分类" prop="category">
        <el-input v-model="drawerProps.row!.category" placeholder="请填写告警分类" clearable></el-input>
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
