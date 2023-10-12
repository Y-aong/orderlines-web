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
        {{ scope.row }}
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" :icon="Download" plain>导出数据</el-button>
        <el-button type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
        <el-button type="danger" :icon="RemoveFilled" plain :disabled="!scope.isSelected"> 批量删除 </el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteTaskInstance(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <taskInstanceDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getTaskInstanceRequest,
  createTaskInstanceRequest,
  updateTaskInstanceRequest,
  deleteTaskInstanceRequest
} from "@/api/orderlines/taskInstance/index";
import { ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, Download, View, RemoveFilled } from "@element-plus/icons-vue";
import taskInstanceDrawer from "./taskInstanceDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof taskInstanceDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createTaskInstanceRequest : title === "编辑" ? updateTaskInstanceRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteTaskInstance = async (params: any) => {
  await useHandleData(deleteTaskInstanceRequest, { id: [params.id] }, `删除【${params.process_name}】流程`);
  proTable.value?.getTableList();
};
// 跳转详情页
const toDetail = (row: any) => {
  if (!row.selectedList[0]) {
    ElMessage.error("请勾选行选择框后，点击详情按钮");
  } else {
    router.push(`/orderlines/taskInstance/detail/${row.selectedList[0].id}`);
  }
};

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getTaskInstanceRequest(newParams);
};

const taskStatusDesc: any = {
  SUCCESS: "运行成功",
  FAILURE: "运行失败",
  STOP: "运行停止",
  RUNNING: "运行中",
  PAUSED: "运行暂停",
  PENDING: "运行排队",
  SKIP: "运行跳过",
  RETRY: "运行重试"
};

const taskStatusTag: any = {
  SUCCESS: "success",
  FAILURE: "danger",
  STOP: "warning",
  RUNNING: "",
  PAUSED: "warning",
  PENDING: "info",
  SKIP: "warning",
  RETRY: "warning"
};

const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "process_id", label: "流程id", search: { el: "input" } },
  { prop: "task_name", label: "任务名称", search: { el: "input" } },
  { prop: "task_id", label: "任务id", search: { el: "input" } },
  { prop: "task_desc", label: "任务描述" },
  {
    prop: "task_status",
    label: "任务状态",
    width: 120,
    search: { el: "input", width: 10 },
    render: (scope: any) => {
      return <el-tag type={taskStatusTag[scope.row.task_status]}>{taskStatusDesc[scope.row.task_status]}</el-tag>;
    }
  },
  {
    prop: "task_result",
    label: "任务结果",
    width: 100,
    render: (scope: any) => {
      return (
        <el-button
          type="primary"
          link
          onClick={() => ElMessage.success(scope.row.task_result ? scope.row.task_result : {})}
        >
          {"任务结果"}
        </el-button>
      );
    }
  },
  {
    prop: "task_error_info",
    label: "任务异常",
    width: 100,
    render: (scope: any) => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.error(scope.row.task_error_info)}>
          {"异常信息"}
        </el-button>
      );
    }
  },
  {
    prop: "start_time",
    label: "开始时间",
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  {
    prop: "end_time",
    label: "结束时间",
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
