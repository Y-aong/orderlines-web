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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">新增变量</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteTaskInstance(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <variableDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getVariableRequest,
  createVariableRequest,
  updateVariableRequest,
  deleteVariableRequest,
  variableExport
} from "@/api/orderlines/orderlinesManager/variable/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import variableDrawer from "./variableDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessageBox } from "element-plus";
import { useDownload } from "@/hooks/useDownload";
import { Variable } from "@/api/orderlines/orderlinesManager/variable/type";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof variableDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createVariableRequest : title === "编辑" ? updateVariableRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出变量配置数据?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(variableExport, "变量配置", proTable.value?.searchParam);
  });
};
// 删除流程信息
const deleteTaskInstance = async (params: Variable.VariableItem) => {
  await useHandleData(deleteVariableRequest, params.id, `删除【${params.variable_key}】变量`);
  proTable.value?.getTableList();
};

const dataCallback = (data: Variable.VariableResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Variable.VariableFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getVariableRequest(newParams);
};

const columns = reactive<ColumnProps<Variable.VariableItem>[]>([
  { type: "expand", label: "展开", width: 65 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "process_name", label: "流程名称", search: { el: "input" } },
  { prop: "variable_key", label: "变量名称", search: { el: "input" } },
  { prop: "variable_value", label: "变量值" },
  { prop: "variable_desc", label: "变量描述" },
  {
    prop: "variable_type",
    label: "变量类型",
    width: 120,
    render: (scope: any) => {
      return <el-tag>{scope.row.variable_type}</el-tag>;
    }
  },
  {
    prop: "is_cache",
    label: "是否缓存",
    render: (scope: any) => {
      return <el-tag>{scope.row.is_cache ? "是" : "否"}</el-tag>;
    }
  },
  { prop: "creator_name", label: "创建者", width: 120, search: { el: "input" } },
  { prop: "updater_name", label: "修改者", width: 120 },
  { prop: "operation", label: "操作", fixed: "right", width: 240 },
  { prop: "insert_time", label: "创建时间", width: 165 },
  { prop: "update_time", label: "修改时间", width: 165 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
