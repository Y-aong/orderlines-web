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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">新增角色</el-button>
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
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import RoleDrawer from "./roleDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";

const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);

const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createRoleRequest : title === "编辑" ? updateRoleRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const deleteRole = async (params: any) => {
  await useHandleData(deleteRoleRequest, { id: [params.id] }, `删除【${params.role_name}】角色`);
  proTable.value?.getTableList();
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
  delete newParams.createTime;
  return getRoleRequest(newParams);
};

const columns = reactive<any>([
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
