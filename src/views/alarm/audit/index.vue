<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteProcess(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getAlarmAuditRequest, updateAlarmAuditRequest, deleteAlarmAuditRequest } from "@/api/alarm/audit/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, View } from "@element-plus/icons-vue";
import auditDrawer from "./auditDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { AlarmAudit } from "@/api/alarm/audit/type";
const alarmLevelOptions = { deadly: "致命", severity: "严重", warning: "警告" };
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof auditDrawer> | null>(null);

const openDrawer = (title: string, row: Partial<AlarmAudit.AlarmAuditItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: updateAlarmAuditRequest,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteProcess = async (params: AlarmAudit.AlarmAuditItem) => {
  await useHandleData(deleteAlarmAuditRequest, params.id, `删除【${params.alarm_name}】告警审计`);
  proTable.value?.getTableList();
};

const dataCallback = (data: AlarmAudit.AlarmAuditResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: AlarmAudit.Filter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAlarmAuditRequest(newParams);
};
const columns = reactive<ColumnProps<AlarmAudit.AlarmAuditItem>[]>([
  { prop: "id", label: "ID", search: { el: "input" }, width: 60 },
  { prop: "group_name", label: "告警组名称", search: { el: "input" } },
  {
    prop: "alarm_label",
    label: "告警标签",
    search: { el: "input" },
    width: 100,
    render: (scope: any) => {
      return <el-tag type="danger">{scope.row.alarm_label}</el-tag>;
    }
  },
  {
    prop: "alarm_level",
    label: "告警等级",
    search: { el: "input" },
    width: 90,
    render: (scope: any) => {
      return <el-tag type="warning">{alarmLevelOptions[scope.row.alarm_level]}</el-tag>;
    }
  },
  {
    prop: "category",
    label: "告警分类",
    width: 100,
    render: (scope: any) => {
      return <el-tag>{scope.row.category}</el-tag>;
    }
  },
  {
    prop: "source",
    label: "告警来源",
    width: 120,
    search: { el: "input" }
  },
  { prop: "created_at", label: "创建时间", width: 170 },
  { prop: "updated_at", label: "更新时间", width: 170 },
  { prop: "handle_name", label: "处理人", search: { el: "input" }, width: 100 },
  { prop: "duration_time", label: "持续时间", search: { el: "input" }, width: 90 },
  { prop: "comments", label: "告警备注" },
  { prop: "version", label: "软件版本", width: 100 },

  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);
const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
