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
        <el-button type="primary" link :icon="Delete" @click="deleteVariableInstance(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <variableInstanceDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getVariableInstanceRequest,
  createVariableInstanceRequest,
  updateVariableInstanceRequest,
  deleteVariableInstanceRequest
} from "@/api/orderlines/variableInstance/index";
import { ProTableInstance } from "@/components/ProTable/interface";
import { Delete, EditPen, Download, View, RemoveFilled } from "@element-plus/icons-vue";
import variableInstanceDrawer from "./variableInstanceDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof variableInstanceDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api:
      title === "新增" ? createVariableInstanceRequest : title === "编辑" ? updateVariableInstanceRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteVariableInstance = async (params: any) => {
  await useHandleData(deleteVariableInstanceRequest, { id: [params.id] }, `删除【${params.variable_key}】变量`);
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
  return getVariableInstanceRequest(newParams);
};

const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "process_name", label: "流程名称", search: { el: "input" } },
  { prop: "variable_key", label: "变量名称", search: { el: "input" } },
  { prop: "variable_value", label: "变量值" },
  { prop: "variable_desc", label: "变量描述" },
  { prop: "variable_type", label: "变量类型" },
  { prop: "creator_name", label: "创建者", width: 100, search: { el: "input" } },
  { prop: "updater_name", label: "修改者", width: 100 },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
