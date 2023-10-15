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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">新增权限</el-button>
      </template>

      <template #expand="scope">
        {{ scope.row }}
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deletePermission(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <PermissionDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getPermissionRequest,
  createPermissionRequest,
  updatePermissionRequest,
  deletePermissionRequest
} from "@/api/auth/permission/index";
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import PermissionDrawer from "./permissionDrawer.vue";

const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof PermissionDrawer> | null>(null);

const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createPermissionRequest : title === "编辑" ? updatePermissionRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除权限
const deletePermission = async (params: any) => {
  await useHandleData(deletePermissionRequest, { id: [params.id] }, `删除【${params.role_name}】角色`);
  proTable.value?.getTableList();
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
  delete newParams.createTime;
  console.log("newParams", newParams);
  return getPermissionRequest(newParams);
};
const reqMethods: any = {
  GET: "查询",
  POST: "创建",
  PUT: "更新",
  DELETE: "删除"
};

const reqMethodTag: any = {
  GET: "success",
  POST: "warning",
  PUT: "",
  DELETE: "danger"
};
const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70, search: { el: "input" } },
  { prop: "name", label: "权限名称", search: { el: "input" } },
  {
    prop: "method",
    label: "请求方法",
    search: { el: "select", props: { filterable: true } },
    enum: [
      { label: "查询", value: "GET" },
      { label: "创建", value: "POST" },
      { label: "更新", value: "PUT" },
      { label: "删除", value: "DELETE" }
    ],
    fieldNames: { label: "label", value: "value" },

    render: (scope: any) => {
      return <el-tag type={reqMethodTag[scope.row.method]}>{reqMethods[scope.row.method]}</el-tag>;
    }
  },
  { prop: "path", label: "请求路径" },
  { prop: "desc", label: "权限描述" },
  { prop: "menu", label: "是否为菜单", search: { el: "input" } },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
