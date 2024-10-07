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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增流程</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        <el-button v-if="!isCard" type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="toProcessConfig(scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteProcess(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ProcessDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getProcessRequest,
  createProcessRequest,
  updateProcessRequest,
  deleteProcessRequest,
  processExport
} from "@/api/orderlines/orderlinesManager/process/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import { useDownload } from "@/hooks/useDownload";
import ProcessDrawer from "./ProcessDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
let { process_name, process_id, process_version } = storeToRefs(useFlowStore());
import useFlowStatueStore from "@/stores/modules/flowStatue";
let { isRunning } = storeToRefs(useFlowStatueStore());
import { setStorage } from "@/utils/storage";

const isCard = ref<boolean>(true);
const router = useRouter();
const proTable = ref<ProTableInstance>();

// 跳转到流程编辑页面
const toProcessConfig = (row: Process.ProcessItem) => {
  process_id.value = row.process_id;
  process_name.value = row.process_name;
  process_version.value = row.version;
  setStorage(row.process_id, "PROCESS_ID");
  setStorage(row.process_name, "PROCESS_NAME");
  setStorage(row.version, "PROCESS_VERSION");

  isRunning.value = false;
  router.push(`/flow/general/index`);
};

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof ProcessDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Process.ProcessItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createProcessRequest : title === "编辑" ? updateProcessRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteProcess = async (params: Process.ProcessItem) => {
  await useHandleData(deleteProcessRequest, params.id, `删除【${params.process_name}】流程`);
  proTable.value?.getTableList();
};
// 跳转详情页
const toDetail = (row: any) => {
  if (!row.selectedList[0]) {
    ElMessage.error("请勾选行选择框后，点击详情按钮");
  } else {
    router.push(`/orderlines/process/detail/${row.selectedList[0].id}`);
  }
};

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出流程数据?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(processExport, "流程列表", proTable.value?.searchParam);
  });
};

const dataCallback = (data: Process.ProcessResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Process.ProcessFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getProcessRequest(newParams);
};
const columns = reactive<ColumnProps<Process.ProcessItem>[]>([
  { type: "expand", label: "展开", width: 60 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "process_name", label: "流程名称", search: { el: "input" } },
  { prop: "version", label: "流程版本", search: { el: "input" } },
  { prop: "namespace", label: "命名空间", search: { el: "input" } },
  { prop: "process_id", label: "流程id", search: { el: "input" } },
  { prop: "desc", label: "流程描述" },
  { prop: "creator_name", label: "创建者", width: 100, search: { el: "input" } },
  { prop: "updater_name", label: "修改者", width: 100, search: { el: "input" } },
  { prop: "mode", label: "运行方式", width: 100, search: { el: "input" } },
  {
    prop: "insert_time",
    label: "创建时间",
    width: 165,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  {
    prop: "update_time",
    label: "修改时间",
    width: 165,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);
const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
