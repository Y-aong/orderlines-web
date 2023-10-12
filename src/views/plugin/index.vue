<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增流程</el-button>
        <el-button type="primary" :icon="Download" plain>导出数据</el-button>
        <el-button type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
        <el-button type="danger" :icon="RemoveFilled" plain :disabled="!scope.isSelected"> 批量删除 </el-button>
      </template>

      <template #expand="scope">
        {{ scope.row }}
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deletePlugin(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <pluginDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getPluginRequest, createPluginRequest, updatePluginRequest, deletePluginRequest } from "@/api/plugin/index";
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View, RemoveFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import pluginDrawer from "./pluginDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";

const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof pluginDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createPluginRequest : title === "编辑" ? updatePluginRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deletePlugin = async (params: any) => {
  await useHandleData(deletePluginRequest, { id: [params.id] }, `删除【${params.variable_key}】变量`);
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

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
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
  return getPluginRequest(newParams);
};
const nodeType: any = {
  "start-node": "开始节点",
  "end-node": "结束节点",
  "select-node": "表记节点",
  "parallel-node": "并行网关",
  "process-control-node": "流程控制",
  "group-node": "任务组",
  "function-node": "普通任务"
};
const nodeTypeTag: any = {
  "start-node": "success",
  "end-node": "success",
  "select-node": "info",
  "parallel-node": "danger",
  "process-control-node": "danger",
  "group-node": "danger",
  "function-node": ""
};

const pluginType: any = {
  BuiltIn: "基础节点",
  ProcessControl: "流程控制网关",
  Group: "任务组网关",
  Parallel: "并行网关"
};

const pluginTagTypes: any = {
  BuiltIn: "success",
  ProcessControl: "danger",
  Group: "warning",
  Parallel: "info"
};

const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "class_name",
    label: "插件名称",
    search: { el: "input" },
    width: 140,
    render: (scope: any) => {
      const pluginTagType = pluginTagTypes[scope.row.class_name] ? pluginTagTypes[scope.row.class_name] : "";
      const pluginName = pluginType[scope.row.class_name] ? pluginType[scope.row.class_name] : scope.row.class_name;
      return <el-tag type={pluginTagType}>{pluginName}</el-tag>;
    }
  },
  { prop: "version", label: "插件版本", width: 120 },
  { prop: "method_name", label: "插件方法", search: { el: "input" }, width: 160 },
  { prop: "method_desc", label: "方法描述", width: 120 },
  {
    prop: "node_type",
    label: "节点类型",
    search: { el: "input" },
    width: 120,
    render: (scope: any) => {
      return <el-tag type={nodeTypeTag[scope.row.node_type]}>{nodeType[scope.row.node_type]}</el-tag>;
    }
  },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
