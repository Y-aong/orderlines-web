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
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新增告警规则</el-button>
        <el-button v-if="!isCard" type="primary" :icon="View" plain @click="toDetail(scope)">详情页面</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteProcess(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <RuleDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import {
  getAlarmRuleRequest,
  createAlarmRuleRequest,
  updateAlarmRuleRequest,
  deleteAlarmRulesRequest
} from "@/api/alarm/rules/index";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import RuleDrawer from "./Drawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { AlarmRules } from "@/api/alarm/rules/type";

const isCard = ref<boolean>(true);
const router = useRouter();
const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof RuleDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<AlarmRules.RuleItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createAlarmRuleRequest : title === "编辑" ? updateAlarmRuleRequest : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除流程信息
const deleteProcess = async (params: AlarmRules.RuleItem) => {
  await useHandleData(deleteAlarmRulesRequest, params.id, `删除【${params.alert_name}】告警`);
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

const dataCallback = (data: AlarmRules.AlarmRulesResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: AlarmRules.Filter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAlarmRuleRequest(newParams);
};
const columns = reactive<ColumnProps<AlarmRules.RuleItem>[]>([
  { type: "expand", label: "展开", width: 80 },
  { prop: "id", label: "序号", search: { el: "input" }, width: 80 },
  { prop: "group_name", label: "告警组", search: { el: "input" }, width: 120 },
  { prop: "instance_name", label: "实例名称", search: { el: "input" }, width: 120 },
  { prop: "job_name", label: "任务名称", search: { el: "input" }, width: 120 },
  { prop: "alert_name", label: "告警名称", search: { el: "input" }, width: 100 },
  { prop: "alert_rule", label: "告警规则", search: { el: "input" } },
  { prop: "duration_time", label: "持续时间", width: 90 },
  { prop: "annotations", label: "告警描述" },
  {
    prop: "restrain_alarm",
    label: "限制告警",
    width: 90
  },
  { prop: "creator_name", label: "创建者", search: { el: "input" } },
  { prop: "updater_name", label: "修改者", search: { el: "input" } },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);
const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
