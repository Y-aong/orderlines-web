<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :is-card="isCard"
      :card-column="cardColumn"
      :change-card="changeCard"
      :card-title="cardTitle"
      :card-layout="cardLayout"
      :select-item="openDrawer"
      :update-item="openDrawer"
    >
      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button
          type="primary"
          link
          :icon="View"
          :disabled="scope.row.confirm && scope.row.job_status == '存在告警'"
          @click="openDrawer('确认', scope.row)"
        >
          确认
        </el-button>
      </template>
    </ProTable>

    <!-- 修改确认框 -->
    <el-dialog v-model="update" title="告警确认" width="30%" top="10vh">
      <div class="confirm-form">
        <el-form :model="form" label-width="auto" style="width: 100%; max-width: 600px" :rules="rules">
          <el-form-item label="告警组名称" prop="group_name">
            <el-input v-model="form.group_name" clearable placeholder="请填写告警组名称" />
          </el-form-item>
          <el-form-item label="告警标签" prop="alarm_label">
            <el-select v-model="form.alarm_label" placeholder="请选择告警标签">
              <el-option v-for="item in alarmLabelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="告警等级" prop="alarm_level">
            <el-select v-model="form.alarm_level" placeholder="请选择告警等级">
              <el-option v-for="item in alarmLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="告警来源" prop="source">
            <el-select v-model="form.source" placeholder="请选择告警等级">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="告警状态" prop="status">
            <el-input v-model="form.status" clearable placeholder="请填写告警状态" />
          </el-form-item>
          <el-form-item label="告警备注" prop="comments">
            <el-input v-model="form.comments" type="textarea" clearable placeholder="请填写告警备注" />
          </el-form-item>
          <el-form-item label="软件版本" prop="version">
            <el-input v-model="form.version" clearable placeholder="请填写软件版本" />
          </el-form-item>
          <el-form-item label="告警分类" prop="category">
            <el-select v-model="form.category" placeholder="请选择告警标签">
              <el-option
                v-for="item in alarmCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="update = false">Cancel</el-button>
          <el-button type="primary" @click="createAlarmAudit"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getPrometheusInstanceRequest, updatePrometheusInstanceRequest } from "@/api/alarm/instance/index";
import { ProTableInstance, ColumnProps, cardProps } from "@/components/ProTable/interface";
import { View } from "@element-plus/icons-vue";
import { cardLayoutProps } from "@/components/ProTable/interface";
import { PrometheusInstance } from "@/api/alarm/instance/type";
import "vue3-json-viewer/dist/index.css";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { getCurrentDate } from "@/utils/currentDateTime";

const { userInfo } = storeToRefs(useUserStore());
const update = ref<boolean>(false);
const router = useRouter();
const isCard = ref<boolean>(true);
const proTable = ref<ProTableInstance>();
const form = reactive<PrometheusInstance.AlarmConfirmItem>({
  id: 1,
  confirm: true,
  group_name: "",
  instance_name: "",
  update_name: "",
  job_name: "",
  alarm_label: "",
  alarm_level: "",
  source: "",
  status: "",
  created_at: "",
  comments: "",
  version: "",
  category: "",
  handle_name: "",
  duration_time: "",
  updated_at: getCurrentDate(),
  link: ""
});

const alarmLabelOptions = [
  { label: "资源问题", value: "资源问题" },
  { label: "外部入侵", value: "外部入侵" },
  { label: "并发过大", value: "并发过大" },
  { label: "代码异常", value: "代码异常" },
  { label: "设计问题", value: "设计问题" },
  { label: "需求不明", value: "需求不明" },
  { label: "告警误报", value: "告警误报" },
  { label: "操作不当", value: "操作不当" }
];

const alarmCategoryOptions = [
  { label: "CPU", value: "cpu" },
  { label: "内存", value: "memory" },
  { label: "磁盘", value: "disk" },
  { label: "网络", value: "network" },
  { label: "应用程序", value: "application" },
  { label: "系统服务", value: "system_service" },
  { label: "集群健康", value: "cluster_health" },
  { label: "数据库", value: "database" },
  { label: "中间件", value: "middleware" },
  { label: "API 和接口", value: "api_and_interfaces" }
];

const alarmLevelOptions = [
  { label: "致命", value: "deadly" },
  { label: "严重", value: "severity" },
  { label: "警告", value: "warning" }
];
const sourceOptions = [
  { label: "用户发现", value: "用户发现" },
  { label: "开发自测", value: "开发自测" },
  { label: "测试发现", value: "测试发现" },
  { label: "领导反馈", value: "领导反馈" },
  { label: "自动预警", value: "自动预警" },
  { label: "其他发现", value: "其他发现" }
];
const openDrawer = async (title: string, row: Partial<PrometheusInstance.PrometheusInstanceItem> = {}) => {
  if (title === "查看") {
    router.push(`/alarm/metrics/${row.instance_name}`);
  } else if (title === "编辑") {
    update.value = true;
    form.id = row.id;
    form.confirm = row.confirm;
    form.group_name = row.group_name;
    form.update_name = userInfo.value.login_value;
    form.job_name = row.job_name;
    form.instance_name = row.instance_name;
    form.duration_time = row.duration_time;
    form.created_at = row.update_time;
    form.handle_name = userInfo.value?.login_value;
  }
};

const createAlarmAudit = async () => {
  try {
    await updatePrometheusInstanceRequest(form);
    ElMessage.success({ message: "告警确认成功！" });
    proTable.value?.getTableList!();
  } catch (error) {
    console.log(error);
  }
  update.value = false;
};

const rules = reactive({
  group_name: [{ required: true, message: "告警组" }],
  instance_name: [{ required: true, message: "实例名称" }],
  alarm_label: [{ required: true, message: "告警标签" }],
  alarm_level: [{ required: true, message: "告警等级" }],
  status: [{ required: true, message: "告警状态" }],
  source: [{ required: true, message: "告警来源" }],
  comments: [{ required: true, message: "告警备注" }],
  alarm_lever: [{ required: true, message: "告警等级" }],
  version: [{ required: true, message: "软件版本" }],
  category: [{ required: false, message: "告警分类" }]
});

const dataCallback = (data: PrometheusInstance.PrometheusInstanceResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: PrometheusInstance.Filter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getPrometheusInstanceRequest(newParams);
};

const cardTitle = ref<string>("instance_name");

const cardColumn: cardProps[] = reactive<cardProps[]>([
  { label: "任务名称", value: "job_name" },
  { label: "监控实例", value: "instance_name" },
  { label: "任务状态", value: "job_status" },
  { label: "告警组名", value: "group_name" },
  { label: "是否确认", value: "confirm" }
]);

const columns = reactive<ColumnProps<PrometheusInstance.PrometheusInstanceItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "展开", width: 80 },
  { prop: "id", label: "序号", search: { el: "input" }, width: 100 },
  { prop: "job_name", label: "任务名称", search: { el: "input" } },
  { prop: "confirm", label: "是否确认", search: { el: "input" } },
  { prop: "group_name", label: "告警组名", search: { el: "input" } },
  { prop: "alarm_level", label: "告警等级", search: { el: "input" } },
  { prop: "instance_name", label: "监控实例", search: { el: "input" } },
  { prop: "job_status", label: "任务状态", search: { el: "input" } },
  {
    prop: "img_url",
    label: "监控对象",
    width: 120,
    render: (scope: any) => {
      if (scope.row && scope.row.img_url)
        return <el-image style="width: 40px; height: 40px;border-radius: 50%" src={scope.row.img_url} lazy />;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const cardLayout = ref<cardLayoutProps>({ xs: 24, sm: 24, md: 12, lg: 12, xl: 6, height: "220px", width: "100%" });
const initParam = reactive({ pageNum: 1, pageSize: 10 });
// 切换卡片布局
const changeCard = () => {
  isCard.value = !isCard.value;
};
</script>

<style lang="scss" scoped>
.confirm-form {
  display: flex;
  align-items: stretch;
  width: 80%;
  height: 100%;
  overflow: hidden;
}
</style>
