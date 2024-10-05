<template>
  <div class="main-box">
    <TreeFilter
      title="流程列表(多选)"
      multiple
      label="name"
      :request-api="getProcessOptionRequest"
      :default-value="treeFilterValues.process_instance_id"
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
        <template #expand="scope">
          <json-viewer :value="scope.row" copyable boxed sort expanded />
        </template>
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteTaskInstance(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <taskInstanceDrawer ref="drawerRef" />

      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>
<script setup lang="tsx" name="scheduleTask">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import taskInstanceDrawer from "./taskInstanceDrawer.vue";
import { getProcessOptionRequest } from "@/api/option/index";
import {
  getTaskInstanceRequest,
  createTaskInstanceRequest,
  updateTaskInstanceRequest,
  deleteTaskInstanceRequest,
  TaskInstanceExport
} from "@/api/orderlines/orderlinesManager/taskInstance/index";
import { useDownload } from "@/hooks/useDownload";
import { TaskInstance } from "@/api/orderlines/orderlinesManager/taskInstance/type";

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

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出流程数据?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(TaskInstanceExport, "任务实例", proTable.value?.searchParam);
  });
};

// 表格配置项
const columns = reactive<ColumnProps<TaskInstance.TaskInstanceItem>[]>([
  { type: "expand", label: "展开", width: 60 },
  { prop: "id", label: "序号", width: 70 },
  { prop: "task_name", label: "任务名称", width: 120 },
  { prop: "method_name", label: "插件方法", width: 140 },
  {
    prop: "task_status",
    label: "任务状态",
    width: 120,
    render: scope => {
      return <el-tag type={taskStatusTag[scope.row.task_status]}>{taskStatusDesc[scope.row.task_status]}</el-tag>;
    }
  },
  { prop: "start_time", label: "开始时间", width: 165 },
  { prop: "end_time", label: "结束时间", width: 165 },
  {
    prop: "task_result",
    label: "任务结果",
    width: 110,
    render: () => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.success("查看任务结果请点击Expand")}>
          {"任务结果"}
        </el-button>
      );
    }
  },
  {
    prop: "task_error_info",
    label: "任务异常",
    width: 110,
    render: () => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.error("查看任务告警请点击Expand")}>
          {"异常信息"}
        </el-button>
      );
    }
  },
  { prop: "operation", label: "操作", width: 240, fixed: "right" }
]);

// selectFilter
const selectFilterData = reactive([
  {
    title: "任务状态(单)",
    key: "task_status",
    options: [
      { label: "全部", value: "" },
      { label: "运行成功", value: "SUCCESS" },
      { label: "运行失败", value: "FAILURE" },
      { label: "运行停止", value: "STOP" },
      { label: "运行超时", value: "TIMEOUT" }
    ]
  }
]);

// 默认 selectFilter 参数
const selectFilterValues = ref({ task_status: "SUCCESS" });
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  proTable.value!.pageable.pageNum = 1;
  selectFilterValues.value = value;
};

// 默认 treeFilter 参数
let treeFilterValues = reactive({ process_instance_id: "" });
const changeTreeFilter = (val: string[]) => {
  proTable.value!.pageable.pageNum = 1;
  treeFilterValues.process_instance_id = val.join(",");
};

// 删除流程信息
const deleteTaskInstance = async (params: TaskInstance.TaskInstanceItem) => {
  await useHandleData(deleteTaskInstanceRequest, params.id, `删除【${params.task_name}】任务实例`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof taskInstanceDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<TaskInstance.TaskInstanceItem> = {}) => {
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
