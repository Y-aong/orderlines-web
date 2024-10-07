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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增插件</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
        </el-button>
      </template>

      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deletePlugin(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <pluginManagerDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getPluginManagerRequest,
  createPluginManagerRequest,
  updatePluginManagerRequest,
  deletePluginManagerRequest
} from "@/api/plugin/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import pluginManagerDrawer from "./pluginManagerDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { Plugin } from "@/api/plugin/type";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof pluginManagerDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Plugin.PluginItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createPluginManagerRequest : title === "编辑" ? updatePluginManagerRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deletePluginManagerRequest, { id }, "删除所选角色信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 删除插件信息
const deletePlugin = async (params: Plugin.PluginItem) => {
  await useHandleData(deletePluginManagerRequest, params.id, `删除【${params.method_name}】插件`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: Plugin.PluginResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Plugin.PluginFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getPluginManagerRequest(newParams);
};
const columns = reactive<ColumnProps<Plugin.PluginItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "model_name", label: "插件模块", width: 120, search: { el: "input" } },
  { prop: "file_name", label: "插件文件", search: { el: "input" } },
  { prop: "desc", label: "插件描述", width: 120, search: { el: "input" } },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "creator_name", label: "创建者" },
  { prop: "updater_name", label: "更新者" },
  {
    prop: "enable",
    label: "是否禁用",
    render: (scope: any) => {
      const EnableTagType = scope.row.enable ? "禁用" : "启用";
      return <el-tag>{EnableTagType}</el-tag>;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
