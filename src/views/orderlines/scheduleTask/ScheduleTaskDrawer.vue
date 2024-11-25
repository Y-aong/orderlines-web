<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}定时任务`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
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
      <el-form-item label="定时任务名称" prop="schedule_task_name">
        <el-input v-model="drawerProps.row!.schedule_task_name" clearable placeholder="请输入定时任务名称"></el-input>
      </el-form-item>
      <el-form-item label="流程名称" prop="process_name">
        <el-select
          v-model="drawerProps.row!.process_name"
          placeholder="请选择流程名称"
          size="large"
          @change="getProcessVersion(drawerProps.row!.process_name)"
        >
          <el-option v-for="item in processNameOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="流程版本" prop="version" clearable>
        <el-select v-model="drawerProps.row!.version" placeholder="请选择流程版本" size="large">
          <el-option v-for="item in processVersionOption" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="定时任务描述" prop="desc" clearable>
        <el-input v-model="drawerProps.row!.desc" clearable placeholder="请输入定时任务描述"></el-input>
      </el-form-item>
      <el-form-item label="可用开始时间" prop="invalid_start_time">
        <el-date-picker
          v-model="drawerProps.row!.invalid_start_time"
          type="datetime"
          :value-format="dateFormat"
          placeholder="选择可用开始时间"
        />
      </el-form-item>
      <el-form-item label="可用结束时间" prop="invalid_end_time">
        <el-date-picker
          v-model="drawerProps.row!.invalid_end_time"
          type="datetime"
          :value-format="dateFormat"
          placeholder="选择可用结束时间"
        />
      </el-form-item>
      <el-form-item label="启动类型" prop="trigger" clearable>
        <el-select
          v-model="drawerProps.row!.trigger"
          placeholder="请选择启动类型"
          size="large"
          @change="trigger = drawerProps.row!.trigger"
        >
          <el-option v-for="item in triggerOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 定时执行配置 -->
      <el-form v-if="trigger === 'date'" :model="dataSchedulePlan" label-width="120px">
        <el-form-item label="执行时间" prop="run_data" clearable>
          <el-date-picker
            v-model="dataSchedulePlan.run_date"
            type="datetime"
            placeholder="选择执行时间"
            :value-format="dateFormat"
          />
        </el-form-item>
      </el-form>
      <!-- 间隔执行配置 -->
      <el-form v-if="trigger === 'interval'" :model="intervalOption" label-width="120px">
        <el-form-item label="执行间隔" prop="interval_type" clearable>
          <el-select v-model="intervalSchedulePlan.interval_type" placeholder="请选择间隔类型" size="large">
            <el-option v-for="item in intervalOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="间隔数值" prop="interval_val" clearable>
          <el-input-number v-model="intervalSchedulePlan.interval_val" :min="1" :max="60" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time" clearable>
          <el-date-picker
            v-model="intervalSchedulePlan.start_date"
            type="datetime"
            placeholder="选择开始时间"
            :value-format="dateFormat"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time" clearable>
          <el-date-picker
            v-model="intervalSchedulePlan.end_date"
            type="datetime"
            placeholder="选择结束时间"
            :value-format="dateFormat"
          />
        </el-form-item>
      </el-form>

      <!-- 周期执行配置 -->
      <CronTab v-if="trigger === 'cron'" />
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="TaskDrawer">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import CronTab from "./CronTab.vue";
import { Option } from "@/api/option/type";
import { BaseResponse } from "@/api/interface/index";
import { getCurrentDate } from "@/utils/currentDateTime";
import { getProcessNameOptionRequest, getProcessVersionOptionRequest } from "@/api/option/index";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";

let { userInfo } = storeToRefs(useUserStore());
let dataSchedulePlan = ref({ run_date: "" });
let intervalSchedulePlan = ref({ interval_type: "", interval_val: 0, start_date: "", end_date: "" });
let cronSchedulePlan = ref({
  year: "*",
  month: "*",
  day: "*",
  week: "*",
  day_of_week: "*",
  hour: "*",
  minute: "*",
  second: "10"
});
let trigger = ref<string>("");
let processNameOption = ref<Option.OptionItem[]>([]);
let processVersionOption = ref<Option.OptionItem[]>([]);
let triggerOption = ref<Option.OptionItem[]>([
  { label: "定时执行", value: "date" },
  { label: "间隔执行", value: "interval" },
  { label: "周期执行", value: "cron" }
]);

const rules = reactive({
  schedule_task_name: [{ required: true, message: "定时任务名称" }],
  process_name: [{ required: true, message: "请填写流程名称" }],
  version: [{ required: false, message: "请填写流程版本" }],
  desc: [{ required: false, message: "请填写定时任务描述" }],
  invalid_start_time: [{ required: false, message: "请选择可用开始时间" }],
  invalid_end_time: [{ required: false, message: "请选择可用结束时间" }],
  trigger: [{ required: true, message: "请填写定时启动类型" }]
});
const dateFormat = ref("YYYY-MM-DD HH:mm:ss");
const process_version_id = ref<string>("");
const intervalOption = ref([
  { label: "秒", value: "seconds" },
  { label: "分", value: "minutes" },
  { label: "时", value: "hours" },
  { label: "天", value: "days" },
  { label: "周", value: "weeks" }
]);

onMounted(async () => {
  await getProcessName();
});

const getProcessName = async () => {
  const response: BaseResponse<Option.OptionResponse> = await getProcessNameOptionRequest();
  processNameOption.value = Array.isArray(response.data) ? response.data : [];
};

const getProcessVersion = async (process_name: string) => {
  const response: BaseResponse<Option.OptionResponse> = await getProcessVersionOptionRequest(process_name);
  processVersionOption.value = Array.isArray(response.data) ? response.data : [];
};

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
  if (params.title === "查看" || params.title === "编辑") {
    trigger.value = params.row.trigger;
    if (params.row.trigger === "date") {
      dataSchedulePlan.value = params.row.schedule_plan;
    } else if (params.row.trigger === "interval") {
      intervalSchedulePlan.value = params.row.schedule_plan;
    }
  } else {
    dataSchedulePlan.value = { run_date: "" };
    intervalSchedulePlan.value = { interval_type: "", interval_val: 0, start_date: "", end_date: "" };
  }

  drawerProps.value = params;
  drawerVisible.value = true;
};
const getProcessId = (version: string) => {
  processVersionOption.value.forEach((item: Option.OptionItem) => {
    if (item.label === version) {
      process_version_id.value = item.value;
    }
  });
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // 定时任务参数处理
      if (drawerProps.value.title === "新增" || drawerProps.value.title === "修改") {
        if (drawerProps.value.title === "新增") {
          drawerProps.value.row["update_time"] = getCurrentDate();
          drawerProps.value.row["updater_name"] = userInfo.value.login_value;
        } else {
          drawerProps.value.row["creator_name"] = userInfo.value.login_value;
        }
        if (trigger.value == "date") {
          drawerProps.value.row["schedule_plan"] = dataSchedulePlan.value;
        } else if (trigger.value == "interval") {
          drawerProps.value.row["schedule_plan"] = intervalSchedulePlan.value;
        } else if (trigger.value == "cron") {
          drawerProps.value.row["schedule_plan"] = cronSchedulePlan.value;
        }
        getProcessId(drawerProps.value.row["version"]);
        drawerProps.value.row["process_id"] = process_version_id.value;
        console.log(drawerProps.value.title, drawerProps.value.row);
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
