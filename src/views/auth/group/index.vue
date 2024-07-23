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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增群组</el-button>
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
        <el-button type="primary" link :icon="Delete" @click="deleteGroup(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <GroupDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getGroupRequest, createGroupRequest, updateGroupRequest, deleteGroupRequest } from "@/api/auth/group/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import GroupDrawer from "./groupDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { Group } from "@/api/auth/group/type";
import "vue3-json-viewer/dist/index.css";

const drawerRef = ref<InstanceType<typeof GroupDrawer> | null>(null);

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteGroupRequest, { id }, "删除所选群组信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const openDrawer = (title: string, row: Partial<Group.GroupItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createGroupRequest : title === "编辑" ? updateGroupRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除群组
const deleteGroup = async (params: Group.GroupItem) => {
  await useHandleData(deleteGroupRequest, params.id, `删除【${params.group_name}】群组`);
  proTable.value?.getTableList();
};

const proTable = ref<ProTableInstance>();

const dataCallback = (data: Group.GroupResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 获取群组列表
const getTableList = (params: Group.GroupFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getGroupRequest(newParams);
};

const columns = reactive<ColumnProps<Group.GroupItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "group_name", label: "群组名称", search: { el: "input" } },
  { prop: "desc", label: "群组描述", search: { el: "input" } },
  { prop: "owner_name", label: "群主名称", search: { el: "input" } },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
