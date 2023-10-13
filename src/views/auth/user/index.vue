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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增', scope)">新增用户</el-button>
        <el-button type="primary" :icon="Download" plain>导出数据</el-button>
        <el-button type="danger" :icon="RemoveFilled" plain :disabled="!scope.isSelected"> 批量删除 </el-button>
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
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, View, RemoveFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import UserDrawer from "./userDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";

const proTable = ref<ProTableInstance>();
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<any> = {}) => {
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

const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "id", label: "序号", width: 70 },
  { prop: "username", label: "用户名", search: { el: "input" } },
  { prop: "phone", label: "手机", search: { el: "input" } },
  { prop: "email", label: "邮箱", search: { el: "input" } },
  {
    prop: "user_image",
    label: "用户头像",
    width: 120,
    render: (scope: any) => {
      return <el-image style="width: 60px; height: 60px;border-radius: 50%" src={scope.row.user_image} lazy />;
    }
  },
  { prop: "create_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
