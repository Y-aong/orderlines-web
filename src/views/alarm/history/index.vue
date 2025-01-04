<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button
          type="primary"
          link
          :icon="EditPen"
          @click="updateAlarm(scope.row)"
          :disabled="scope.row.people_confirm"
        >
          告警确认
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="deletePlugin(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <historyDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getAlarmHistoryRequest,
  updateAlarmHistoryRequest,
  deleteAlarmHistoryRequest
} from "@/api/alarm/history/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import historyDrawer from "./historyDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { AlarmHistory } from "@/api/alarm/history/type";
import { getCurrentDate } from "@/utils/currentDateTime";
import { BaseUpdateResponse } from "@/api/interface";
import { useGlobalStore } from "@/stores/modules/global";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());

let { refreshMessage } = storeToRefs(useGlobalStore());

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof historyDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<AlarmHistory.AlarmHistoryItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: updateAlarmHistoryRequest,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const updateAlarm = async (row: AlarmHistory.AlarmHistoryItem) => {
  if (row.confirm) {
    ElMessage.warning("告警已经确认");
    return;
  }
  row["update_time"] = getCurrentDate();
  row["people_confirm"] = true;
  row["updater_name"] = userInfo.value.login_value;

  const response: BaseUpdateResponse = await updateAlarmHistoryRequest(row);
  if (response.code == 200) {
    ElMessage.success("告警确认成功");
    refreshMessage.value = true;
  } else {
    ElMessage.error("告警确认失败" + response.message);
  }
};

// 删除告警信息
const deletePlugin = async (params: AlarmHistory.AlarmHistoryItem) => {
  await useHandleData(deleteAlarmHistoryRequest, params.id, `删除【${params.instance_name}】告警`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: AlarmHistory.AlarmNoticeResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: AlarmHistory.Filter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAlarmHistoryRequest(newParams);
};

const alarmLevelOptions = { deadly: "致命", severity: "严重", warning: "警告" };
const alarmLevelTypeOptions = { deadly: "danger", severity: "warning", warning: "warning" };

const columns = reactive<ColumnProps<AlarmHistory.AlarmHistoryItem>[]>([
  { type: "expand", label: "展开", width: 60 },
  {
    prop: "id",
    label: "序号",
    search: { el: "input" },
    width: 60
  },
  {
    prop: "group_name",
    label: "任务组名称",
    search: { el: "input" },
    width: 110
  },
  {
    prop: "alert_name",
    label: "告警名称",
    search: { el: "input" },
    width: 100
  },
  {
    prop: "job_name",
    label: "任务名称",
    search: { el: "input" },
    width: 100
  },
  {
    prop: "instance_name",
    label: "监控实例",
    search: { el: "input" }
  },
  {
    prop: "job_status",
    label: "任务状态",
    search: { el: "input" },
    width: 90,
    render: (scope: any) => {
      return (
        <el-tag type={alarmLevelTypeOptions[scope.row.job_status]}>{alarmLevelOptions[scope.row.job_status]}</el-tag>
      );
    }
  },
  { prop: "insert_time", label: "插入时间", width: 165 },
  { prop: "duration_time", label: "持续时间", width: 90 },
  { prop: "annotations", label: "告警描述" },
  {
    prop: "confirm",
    label: "是否确认",
    search: { el: "input" },
    width: 90,
    render: (scope: any) => {
      return (
        <el-tag type={scope.row.people_confirm ? "success" : "danger"}>
          {scope.row.people_confirm ? "确认" : "未确认"}
        </el-tag>
      );
    }
  },
  { prop: "updater_name", label: "处理人", width: 100 },

  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
