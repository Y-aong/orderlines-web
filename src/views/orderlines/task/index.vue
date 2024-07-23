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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">新增任务</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteTask(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <TaskDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getTaskRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  taskExport
} from "@/api/orderlines/orderlinesManager/task/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import TaskDrawer from "./taskDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof TaskDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createTaskRequest : title === "编辑" ? updateTaskRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出任务数据?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(taskExport, "任务数据", proTable.value?.searchParam);
  });
};

// 删除流程信息
const deleteTask = async (params: Task.TaskItem) => {
  await useHandleData(deleteTaskRequest, params.id, `删除【${params.task_name}】任务`);
  proTable.value?.getTableList();
};

const dataCallback = (data: Task.TaskResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Task.TaskFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getTaskRequest(newParams);
};

const columns = reactive<ColumnProps<Task.TaskItem>[]>([
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "task_name", label: "任务名称", search: { el: "input" } },
  { prop: "task_id", label: "任务id", search: { el: "input" } },
  { prop: "desc", label: "任务描述" },
  { prop: "creator", label: "创建者", width: 100, search: { el: "input" } },
  { prop: "updater", label: "修改者", width: 100, search: { el: "input" } },
  {
    prop: "insert_time",
    label: "插入时间",
    width: 200,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  {
    prop: "update_time",
    label: "修改时间",
    width: 200,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
