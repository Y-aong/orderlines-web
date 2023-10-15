<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
      :is-card="isCard"
      :card-column="cardColumn"
      :change-card="changeCard"
      :card-title="cardTitle"
      :card-layout="cardLayout"
      :select-item="openDrawer"
      :update-item="openDrawer"
      :delete-item="deleteUser"
    >
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">新增用户</el-button>
      </template>

      <template #expand="scope">
        {{ scope.row }}
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteUser(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getUserRequest, createUserRequest, updateUserRequest, deleteUserRequest } from "@/api/auth/user/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import UserDrawer from "./userDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { cardLayoutProps } from "@/components/ProTable/interface";
import { User } from "@/api/auth/user/type";

const isCard = ref<boolean>(true);
const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createUserRequest : title === "编辑" ? updateUserRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const deleteUser = async (params: any) => {
  await useHandleData(deleteUserRequest, { id: [params.id] }, `删除【${params.username}】用户`);
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
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserRequest(newParams);
};
const cardTitle = ref<string>("username");

const cardColumn: any = reactive<any>([
  { label: "用户编号", value: "id" },
  { label: "用户名称", value: "username" },
  { label: "用户手机", value: "phone" },
  { label: "用户邮箱", value: "email" },
  { label: "创建时间", value: "create_time" },
  { label: "修改时间", value: "update_time" }
]);

const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70 },
  { prop: "username", label: "用户名", search: { el: "input" } },
  { prop: "phone", label: "手机", search: { el: "input" } },
  { prop: "email", label: "邮箱", search: { el: "input" } },
  {
    prop: "img_url",
    label: "用户头像",
    width: 120,
    render: (scope: any) => {
      return <el-image style="width: 60px; height: 60px;border-radius: 50%" src={scope.row.img_url} lazy />;
    }
  },
  { prop: "create_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const cardLayout = ref<cardLayoutProps>({ xs: 24, sm: 24, md: 12, lg: 6, xl: 8, height: "320px", width: "100%" });
const initParam = reactive({ pageNum: 1, pageSize: 10 });
// 切换卡片布局
const changeCard = () => {
  isCard.value = !isCard.value;
};
</script>

<style lang="scss" scoped></style>
