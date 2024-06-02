<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}流程`">
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
          <el-input v-model="drawerProps.row!.id" placeholder="请填写流程名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="流程id" prop="process_id">
          <el-input v-model="drawerProps.row!.process_id" clearable></el-input>
        </el-form-item>
      </template>
      <el-form-item label="流程名称" prop="process_name">
        <el-input v-model="drawerProps.row!.process_name" placeholder="请填写流程名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="流程版本" prop="version">
        <el-input v-model="drawerProps.row!.version" placeholder="请填写流程版本" clearable></el-input>
      </el-form-item>
      <el-form-item label="流程描述" prop="desc" clearable>
        <el-input v-model="drawerProps.row!.desc" placeholder="请填写流程描述" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="ProcessDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getCurrentDate } from "@/utils/currentDateTime";
import { storeToRefs } from "pinia";
import { v4 as uuid } from "uuid";
import { Process } from "@/api/orderlines/process/type";
import useFlowStore from "@/stores/modules/flow";
let { isRunning, process_name, process_id, process_version } = storeToRefs(useFlowStore());
import { setStorage } from "@/utils/storage";
import { useRouter } from "vue-router";
const router = useRouter();

// 跳转到流程编辑页面
const toProcessConfig = async (row: Process.ProcessItem) => {
  process_id.value = row.process_id;
  process_name.value = row.process_name;
  process_version.value = row.process_id;
  setStorage(row.process_id, "PROCESS_ID");
  setStorage(row.process_name, "PROCESS_NAME");
  setStorage(row.process_id, "PROCESS_VERSION");
  isRunning.value = false;
  router.push(`/flow/general`);
};

const rules = reactive({
  process_name: [{ required: true, message: "请填写流程名称" }],
  version: [{ required: false, message: "请填写流程版本" }],
  desc: [{ required: false, message: "请填写流程描述" }]
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
  ruleFormRef.value!.validate(async (valid: any) => {
    if (!valid) return;
    try {
      if (drawerProps.value.title === "新增") {
        drawerProps.value.row["process_id"] = uuid();
      }

      if (drawerProps.value.title === "编辑") {
        let process: any = {};
        process.id = drawerProps.value.row.id;
        process.process_name = drawerProps.value.row.process_name;
        process.desc = drawerProps.value.row.desc;
        process.update_time = getCurrentDate();
        process.process_params = { timeout: 7200, notice_type: "FAILURE", is_send: true };
        process.drawerProps.value.row = process;
      }
      console.log(drawerProps.value.row);

      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}流程成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
      await toProcessConfig(drawerProps.value.row as Process.ProcessItem);
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
