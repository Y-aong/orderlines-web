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
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">创建定时任务</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteTask(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ScheduleTaskDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getScheduleTaskRequest,
  createScheduleTaskRequest,
  updateScheduleTaskRequest,
  deleteScheduleTaskRequest,
  downloadScheduleTaskRequest
} from "@/api/orderlines/orderlinesSchedule/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View, Download } from "@element-plus/icons-vue";
import ScheduleTaskDrawer from "./ScheduleTaskDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessageBox } from "element-plus";
import { ScheduleTask } from "@/api/orderlines/orderlinesSchedule/type";
import { useDownload } from "@/hooks/useDownload";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof ScheduleTaskDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createScheduleTaskRequest : title === "编辑" ? updateScheduleTaskRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出定时任务数据?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(downloadScheduleTaskRequest, "定时任务", proTable.value?.searchParam);
  });
};

// 删除流程信息
const deleteTask = async (params: ScheduleTask.ScheduleTaskItem) => {
  await useHandleData(deleteScheduleTaskRequest, { id: [params.id] }, `删除【${params.schedule_task_name}】任务`);
  proTable.value?.getTableList();
};

const dataCallback = (data: ScheduleTask.ScheduleTaskResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: ScheduleTask.ScheduleTaskFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getScheduleTaskRequest(newParams);
};

const triggerType: any = {
  date: "定时执行",
  interval: "间隔执行",
  crontab: "周期执行"
};

const triggerTagType: any = {
  date: "primary",
  interval: "warning",
  crontab: "danger"
};

const columns = reactive<ColumnProps<ScheduleTask.ScheduleTaskItem>[]>([
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "schedule_task_name", label: "定时任务名称", width: 120, search: { el: "input" } },
  { prop: "process_name", label: "流程名称", width: 120, search: { el: "input" } },
  { prop: "process_id", label: "流程id", width: 100, search: { el: "input" } },
  { prop: "version", label: "流程版本", width: 100, search: { el: "input" } },
  { prop: "invalid_start_time", label: "可用开始时间", width: 120, search: { el: "input" } },
  { prop: "invalid_end_time", label: "可用结束时间", width: 120, search: { el: "input" } },
  { prop: "creator_name", label: "创建者", width: 120, search: { el: "input" } },
  { prop: "updater_name", label: "更新者", width: 120, search: { el: "input" } },
  {
    prop: "insert_time",
    label: "插入时间",
    width: 170,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  {
    prop: "update_time",
    label: "修改时间",
    width: 170,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  {
    prop: "trigger",
    label: "定时类型",
    width: 100,
    search: { el: "input" },
    render: scope => {
      return <el-tag type={triggerTagType[scope.row.trigger]}>{triggerType[scope.row.trigger]}</el-tag>;
    }
  },
  { prop: "update_time", label: "下次运行时间", width: 180 },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
