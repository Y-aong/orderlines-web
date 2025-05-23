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
      <el-form-item label="告警组" prop="group_name">
        <el-select v-model="drawerProps.row!.notice_group" placeholder="请选择告警组">
          <el-option v-for="item in alarmOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="实例名称" prop="instance_name">
        <el-select v-model="drawerProps.row!.instance_name" placeholder="请选择实例名称">
          <el-option v-for="item in instanceNameOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="job_name">
        <el-select v-model="drawerProps.row!.job_name" placeholder="请选择任务名称">
          <el-option v-for="item in jobNameOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警名称" prop="alert_name">
        <el-input v-model="drawerProps.row!.alert_name" placeholder="请填写告警名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警规则" prop="alert_rule">
        <el-input v-model="drawerProps.row!.alert_rule" placeholder="请填写告警规则" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警阈值" prop="threshold">
        <el-input v-model="drawerProps.row!.threshold" placeholder="请填写告警阈值" clearable></el-input>
      </el-form-item>
      <el-form-item label="比较方式" prop="comparison_mode">
        <el-select v-model="drawerProps.row!.comparison_mode" placeholder="请选择比较方式">
          <el-option v-for="item in comparisonModeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="持续时间" prop="duration_time">
        <el-input v-model="drawerProps.row!.duration_time" placeholder="请填写持续时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="告警等级" prop="alarm_lever" clearable>
        <el-select v-model="drawerProps.row!.alarm_lever" placeholder="请选择告警等级">
          <el-option v-for="item in alarmLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警注解" prop="annotations" clearable>
        <el-input v-model="drawerProps.row!.annotations" placeholder="请填写告警注解" clearable></el-input>
      </el-form-item>
      <el-form-item label="抑制告警" prop="restrain_alarm" clearable>
        <el-radio-group v-model="drawerProps.row!.restrain_alarm">
          <el-radio value="true" size="large">抑制</el-radio>
          <el-radio value="false" size="large">不抑制</el-radio>
        </el-radio-group>
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
import { getAlarmJobOptRequest, getAlarmInstanceOptRequest, getAlarmGroupOptRequest } from "@/api/option/index";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";

const { userInfo } = storeToRefs(useUserStore());
const jobNameOptions = ref<any>([]);
const instanceNameOptions = ref<any>([]);
const alarmOptions = ref<any>([]);
const alarmLevelOptions = [
  { label: "致命", value: "deadly" },
  { label: "严重", value: "severity" },
  { label: "警告", value: "warning" }
];

const comparisonModeOptions = [
  { label: "大于", value: ">" },
  { label: "小于", value: "<" },
  { label: "等于", value: "=" },
  { label: "大于等于", value: ">=" },
  { label: "小于等于", value: "<=" }
];

onMounted(async () => {
  const jobResponse = await getAlarmJobOptRequest();
  jobNameOptions.value = jobResponse.data;
  const instanceResponse = await getAlarmInstanceOptRequest();
  instanceNameOptions.value = instanceResponse.data;
  const alarmGroupResponse = await getAlarmGroupOptRequest();
  alarmOptions.value = alarmGroupResponse.data;
});

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const rules = reactive({
  group_name: [{ required: true, message: "告警组" }],
  instance_name: [{ required: true, message: "实例名称" }],
  job_name: [{ required: true, message: "任务名称" }],
  alert_name: [{ required: true, message: "告警名称" }],
  alert_rule: [{ required: true, message: "告警规则" }],
  threshold: [{ required: true, message: "告警阈值" }],
  comparison_mode: [{ required: true, message: "比较方式" }],
  duration_time: [{ required: true, message: "持续时间" }],
  alarm_lever: [{ required: true, message: "告警等级" }],
  notice_name: [{ required: true, message: "通知人" }],
  notice_group: [{ required: false, message: "通知组" }]
});

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
      if (!drawerProps.value.row.node_type) drawerProps.value.row.node_type = "function-node";
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
