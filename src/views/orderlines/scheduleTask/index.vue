<template>
  <div class="main-box">
    <TreeFilter
      title="流程列表(多选)"
      multiple
      label="name"
      :request-api="getProcessOptionRequest"
      :default-value="treeFilterValues.departmentId"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter :data="selectFilterData" :default-values="selectFilterValues" @change="changeSelectFilter" />
      </div>
      <ProTable
        ref="proTable"
        highlight-current-row
        :columns="columns"
        :request-api="getTaskInstanceRequest"
        :init-param="Object.assign(treeFilterValues, selectFilterValues)"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="Upload" plain>批量添加</el-button>
          <el-button type="primary" :icon="Download" plain>导出数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>
<script setup lang="tsx" name="scheduleTask">
import { ref, reactive, watch } from "vue";
import { User } from "@/api/interface";
import { ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import { getProcessOptionRequest } from "@/api/orderlines/processInstance/index";
import {
  getTaskInstanceRequest,
  createTaskInstanceRequest,
  updateTaskInstanceRequest,
  deleteTaskInstanceRequest
} from "@/api/orderlines/taskInstance/index";

// ProTable 实例
const proTable = ref<ProTableInstance>();

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

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { prop: "id", label: "序号", width: 70 },
  { prop: "task_name", label: "任务名称", width: 120 },
  { prop: "method_name", label: "插件方法", width: 120 },
  {
    prop: "task_status",
    label: "任务状态",
    width: 120,
    render: (scope: any) => {
      return <el-tag type={taskStatusTag[scope.row.task_status]}>{taskStatusDesc[scope.row.task_status]}</el-tag>;
    }
  },
  { prop: "start_time", label: "开始时间" },
  { prop: "end_time", label: "结束时间" },
  {
    prop: "task_result",
    label: "任务结果",
    width: 110,
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
    width: 110,
    render: (scope: any) => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.error(scope.row.task_error_info)}>
          {"异常信息"}
        </el-button>
      );
    }
  },
  { prop: "runner", label: "运行者", width: 100 },
  { prop: "operation", label: "操作", width: 240, fixed: "right" }
]);

// selectFilter 数据（用户角色为后台数据）
const selectFilterData = reactive([
  {
    title: "任务状态(单)",
    key: "task_status",
    options: [
      { label: "全部", value: "" },
      { label: "运行成功", value: "1", icon: "User" },
      { label: "运行失败", value: "2", icon: "Bell" },
      { label: "运行停止", value: "3", icon: "Clock" },
      { label: "运行超时", value: "4", icon: "CircleClose" }
    ]
  }
]);

// 默认 selectFilter 参数
const selectFilterValues = ref({ userStatus: "2", userRole: ["1", "3"] });
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  proTable.value!.pageable.pageNum = 1;
  selectFilterValues.value = value;
};

// 默认 treeFilter 参数
const treeFilterValues = reactive({ departmentId: ["11"] });
const changeTreeFilter = (val: string[]) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  proTable.value!.pageable.pageNum = 1;
  treeFilterValues.departmentId = val;
};

watch(
  () => proTable.value?.radio,
  () => proTable.value?.radio && ElMessage.success(`选中 id 为【${proTable.value?.radio}】的数据`)
);

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteTaskInstanceRequest, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<any>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createTaskInstanceRequest : title === "编辑" ? updateTaskInstanceRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
