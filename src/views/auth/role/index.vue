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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增角色</el-button>
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
        {{ scope.row }}
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteRole(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <RoleDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getRoleRequest, createRoleRequest, updateRoleRequest, deleteRoleRequest } from "@/api/auth/role/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import RoleDrawer from "./roleDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { Role } from "@/api/auth/role/type";

const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);

const openDrawer = (title: string, row: Partial<Role.RoleItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createRoleRequest : title === "编辑" ? updateRoleRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteRoleRequest, { id }, "删除所选角色信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const deleteRole = async (params: Role.RoleItem) => {
  await useHandleData(deleteRoleRequest, { id: [params.id] }, `删除【${params.role_name}】角色`);
  proTable.value?.getTableList();
};

const dataCallback = (data: Role.RoleResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Role.RoleFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getRoleRequest(newParams);
};

const columns = reactive<ColumnProps<Role.RoleItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70 },
  { prop: "role_name", label: "角色名称", search: { el: "input" } },
  { prop: "desc", label: "角色描述", search: { el: "input" } },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
