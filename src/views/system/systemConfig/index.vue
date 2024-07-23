<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增配置</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
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

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteSystemSetting(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <systemSettingDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getSystemSettingRequest,
  createSystemSettingRequest,
  updateSystemSettingRequest,
  deleteSystemSettingRequest,
  SystemSettingExport
} from "@/api/system/setting/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View } from "@element-plus/icons-vue";
import systemSettingDrawer from "./systemSettingDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { ElMessageBox } from "element-plus";
import { Conf } from "@/api/system/setting/type";

const proTable = ref<ProTableInstance>();

// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出系统配置?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(SystemSettingExport, "系统配置", proTable.value?.searchParam);
  });
};

// 新增，查看，编辑
const drawerRef = ref<any>(null);
const openDrawer = (title: string, row: Partial<Conf.ConfItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createSystemSettingRequest : title === "编辑" ? updateSystemSettingRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteSystemSettingRequest, { id }, "删除所选角色信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 删除流程信息
const deleteSystemSetting = async (params: Conf.ConfItem) => {
  await useHandleData(deleteSystemSettingRequest, params.id, `删除【${params.config_name}】系统配置`);
  proTable.value?.getTableList();
};

const dataCallback = (data: Conf.ConfResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Conf.ConfFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getSystemSettingRequest(newParams);
};

const columns = reactive<ColumnProps<Conf.ConfItem>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "config_name", label: "配置名称", search: { el: "input" } },
  { prop: "config_value", label: "配置值" },
  { prop: "desc", label: "配置描述", search: { el: "input" } },
  { prop: "insert_time", label: "插入时间" },
  { prop: "update_time", label: "更新时间" },
  { prop: "creator_name", label: "创建者", width: 100 },
  { prop: "updater_name", label: "修改者", width: 100 },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
