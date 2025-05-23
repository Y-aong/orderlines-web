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
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        <el-button type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteVariableInstance(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <variableInstanceDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getVariableInstanceRequest,
  deleteVariableInstanceRequest,
  VariableInstanceExport
} from "@/api/orderlines/orderlinesManager/variableInstance/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Delete, Download, View } from "@element-plus/icons-vue";
import variableInstanceDrawer from "./variableInstanceDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
import { VariableInstance } from "@/api/orderlines/orderlinesManager/variableInstance/type";

const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof variableInstanceDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<VariableInstance.VariableInstanceItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出变量实例?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(VariableInstanceExport, "变量实例", proTable.value?.searchParam);
  });
};

// 删除流程信息
const deleteVariableInstance = async (params: VariableInstance.VariableInstanceItem) => {
  await useHandleData(deleteVariableInstanceRequest, params.id, `删除【${params.variable_key}】变量实例`);
  proTable.value?.getTableList();
};
// 跳转详情页
const toDetail = (row: any) => {
  if (!row.selectedList[0]) {
    ElMessage.error("请勾选行选择框后，点击详情按钮");
  } else {
    router.push(`/orderlines/variableInstance/detail/${row.selectedList[0].id}`);
  }
};

const dataCallback = (data: VariableInstance.VariableInstanceResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: VariableInstance.VariableInstanceFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getVariableInstanceRequest(newParams);
};

const columns = reactive<ColumnProps<VariableInstance.VariableInstanceItem>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "expand", label: "展开", width: 65 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "process_name", label: "流程名称", search: { el: "input" } },
  { prop: "variable_key", label: "变量名称", search: { el: "input" } },
  { prop: "variable_value", label: "变量值" },
  { prop: "variable_desc", label: "变量描述", width: 120 },
  {
    prop: "variable_type",
    label: "变量类型",
    width: 90,
    render: (scope: any) => {
      return <el-tag>{scope.row.variable_type}</el-tag>;
    }
  },
  {
    prop: "is_global",
    search: { el: "select", props: { filterable: true } },
    enum: [
      { label: "是全局变量", value: 1 },
      { label: "否全局变量", value: 0 }
    ],
    label: "全局变量",
    render: (scope: any) => {
      const isGlobal = scope.row.is_global ? "success" : "warning";
      return <el-tag type={isGlobal}>{scope.row.is_global ? "是" : "否"}</el-tag>;
    }
  },
  { prop: "creator_name", label: "创建者", width: 100, search: { el: "input" } },
  { prop: "updater_name", label: "修改者", width: 100 },
  { prop: "insert_time", label: "创建时间", width: 165 },
  { prop: "update_time", label: "修改时间", width: 165 },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
