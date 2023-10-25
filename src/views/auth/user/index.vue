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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增用户</el-button>
        <el-button
          v-if="!isCard"
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
import { ProTableInstance, ColumnProps, cardProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import UserDrawer from "./userDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { cardLayoutProps } from "@/components/ProTable/interface";
import { User } from "@/api/auth/user/type";
import "vue3-json-viewer/dist/index.css";

const isCard = ref<boolean>(true);
const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.UserItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createUserRequest : title === "编辑" ? updateUserRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUserRequest, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const deleteUser = async (params: User.UserItem) => {
  await useHandleData(deleteUserRequest, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: User.UserResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: User.UserFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getUserRequest(newParams);
};
const cardTitle = ref<string>("username");

const cardColumn: cardProps[] = reactive<cardProps[]>([
  { label: "用户编号", value: "id" },
  { label: "用户名称", value: "username" },
  { label: "用户手机", value: "phone" },
  { label: "用户邮箱", value: "email" },
  { label: "创建时间", value: "insert_time" },
  { label: "修改时间", value: "update_time" }
]);

const columns = reactive<ColumnProps<User.UserItem>[]>([
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
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const cardLayout = ref<cardLayoutProps>({ xs: 24, sm: 24, md: 12, lg: 12, xl: 8, height: "320px", width: "100%" });
const initParam = reactive({ pageNum: 1, pageSize: 10 });
// 切换卡片布局
const changeCard = () => {
  isCard.value = !isCard.value;
};
</script>

<style lang="scss" scoped></style>
