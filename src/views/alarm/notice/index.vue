<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增告警通知</el-button>
        <el-button v-if="!isCard" type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteProcess(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <NoticeDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getAlarmNoticeRequest,
  createAlarmNoticeRequest,
  updateAlarmNoticeRequest,
  deleteAlarmNoticeRequest
} from "@/api/alarm/notice/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import NoticeDrawer from "./noticeDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { AlarmNotice } from "@/api/alarm/notice/type";

const isCard = ref<boolean>(true);
const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof NoticeDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<AlarmNotice.AlarmNoticeItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createAlarmNoticeRequest : title === "编辑" ? updateAlarmNoticeRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteProcess = async (params: AlarmNotice.AlarmNoticeItem) => {
  await useHandleData(deleteAlarmNoticeRequest, params.id, `删除【${params.notice_name}】告警通知`);
  proTable.value?.getTableList();
};
// 跳转详情页
const toDetail = (row: any) => {
  if (!row.selectedList[0]) {
    ElMessage.error("请勾选行选择框后，点击详情按钮");
  } else {
    router.push(`/orderlines/process/detail/${row.selectedList[0].id}`);
  }
};

const dataCallback = (data: AlarmNotice.AlarmNoticeResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: AlarmNotice.Filter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAlarmNoticeRequest(newParams);
};
const columns = reactive<ColumnProps<AlarmNotice.AlarmNoticeItem>[]>([
  { type: "expand", label: "展开", width: 60 },
  { prop: "group_name", label: "告警组名", search: { el: "input" } },
  { prop: "notice_name", label: "告警接收人", search: { el: "input" } },
  { prop: "notice_id", label: "接收人ID", search: { el: "input" } },
  { prop: "notice_group_name", label: "告警接收组", search: { el: "input" } },
  { prop: "notice_group_id", label: "告警接收组", search: { el: "input" } },
  { prop: "notice_type", label: "通知类型", search: { el: "input" } },
  { prop: "creator_name", label: "创建者", width: 120, search: { el: "input" } },
  { prop: "updater_name", label: "修改者", width: 120, search: { el: "input" } },
  { prop: "insert_time", label: "创建时间", width: 200 },
  { prop: "update_time", label: "修改时间", width: 200 },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);
const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
