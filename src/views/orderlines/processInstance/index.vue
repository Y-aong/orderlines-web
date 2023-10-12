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
        <el-button type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
        <el-button type="primary" :icon="Download" plain>导出数据</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">归档</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteProcess(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ProcessInstanceDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getProcessInstanceRequest,
  createProcessInstanceRequest,
  updateProcessInstanceRequest,
  deleteProcessInstanceRequest
} from "@/api/orderlines/processInstance/index";
import { ProTableInstance } from "@/components/ProTable/interface";
import ProcessInstanceDrawer from "./ProcessInstanceDrawer.vue";
import { Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof ProcessInstanceDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createProcessInstanceRequest : title === "编辑" ? updateProcessInstanceRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteProcess = async (params: any) => {
  await useHandleData(deleteProcessInstanceRequest, { id: [params.id] }, `删除【${params.process_name}】流程`);
  proTable.value?.getTableList();
};
// 跳转详情页
const toDetail = (row: any) => {
  if (!row.selectedList[0]) {
    ElMessage.error("请勾选行选择框后，点击详情按钮");
  } else {
    router.push(`/orderlines/processInstance/detail/${row.selectedList[0].id}`);
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
  return getProcessInstanceRequest(newParams);
};
const processStatusDesc: any = {
  SUCCESS: "运行成功",
  FAILURE: "运行失败",
  STOP: "运行停止",
  RUNNING: "运行中",
  PAUSED: "运行暂停",
  PENDING: "运行排队"
};

const processStatusTag: any = {
  SUCCESS: "success",
  FAILURE: "danger",
  STOP: "warning",
  PENDING: "",
  RUNNING: "info",
  PAUSED: "warning"
};

const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "process_name", label: "流程名称", search: { el: "input" } },
  { prop: "process_id", label: "流程id", search: { el: "input" } },
  { prop: "desc", label: "流程描述" },
  {
    prop: "process_status",
    label: "流程状态",
    width: 120,
    render: (scope: any) => {
      return <el-tag type={processStatusTag[scope.row.run_type]}>{processStatusDesc[scope.row.process_status]}</el-tag>;
    }
  },
  {
    prop: "run_type",
    label: "触发方式",
    render: (scope: any) => {
      return (
        <el-tag type={scope.row.run_type === "trigger" ? "success" : "warning"}>
          {scope.row.run_type === "trigger" ? "手动" : "定时"}
        </el-tag>
      );
    }
  },
  {
    prop: "start_time",
    label: "开始时间",
    width: 200,
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
