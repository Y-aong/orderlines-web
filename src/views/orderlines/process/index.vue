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
      :delete-item="deleteProcess"
    >
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增流程</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        <el-button v-if="!isCard" type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
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
} from "@/api/orderlines/process/index";
import { ColumnProps, ProTableInstance, cardProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import { cardLayoutProps } from "@/components/ProTable/interface";
import { useDownload } from "@/hooks/useDownload";
import ProcessDrawer from "./ProcessDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Process } from "@/api/orderlines/process/type";

const isCard = ref<boolean>(true);
const router = useRouter();
const proTable = ref<ProTableInstance>();
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
  await useHandleData(deleteProcessRequest, { id: [params.id] }, `删除【${params.process_name}】流程`);
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
const cardTitle = ref<string>("process_name");
const cardColumn: cardProps[] = reactive<cardProps[]>([
  { label: "流程序号", value: "id" },
  { label: "流程名称", value: "process_name" },
  { label: "流程描述", value: "desc" },
  { label: "创建者", value: "creator" },
  { label: "修改者", value: "updater" },
  { label: "插入时间", value: "insert_time" },
  { label: "修改时间", value: "update_time" }
]);
const columns = reactive<ColumnProps<Process.ProcessItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "process_name", label: "流程名称", search: { el: "input" } },
  { prop: "process_id", label: "流程id", search: { el: "input" } },
  { prop: "desc", label: "流程描述" },
  { prop: "creator", label: "创建者", width: 100, search: { el: "input" } },
  { prop: "updater", label: "修改者", width: 100, search: { el: "input" } },
  {
    prop: "insert_time",
    label: "插入时间",
    width: 200,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  {
    prop: "update_time",
    label: "修改时间",
    width: 200,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);
const cardLayout = ref<cardLayoutProps>({ xs: 24, sm: 24, md: 12, lg: 6, xl: 8, height: "280px", width: "100%" });
const initParam = reactive({ pageNum: 1, pageSize: 10 });
// 切换卡片布局
const changeCard = () => {
  isCard.value = !isCard.value;
};
</script>

<style lang="scss" scoped></style>
