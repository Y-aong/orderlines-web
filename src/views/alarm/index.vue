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
      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="updateAlarm(scope.row)">告警确认</el-button>
        <el-button type="primary" link :icon="Delete" @click="deletePlugin(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <alarmDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getAlarmRequest, updateAlarmRequest, deleteAlarmRequest } from "@/api/alarm/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import alarmDrawer from "./alarmDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { Alarm } from "@/api/alarm/type";
import { getCurrentDate } from "@/utils/currentDateTime";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof alarmDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Alarm.AlarmItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: updateAlarmRequest,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const updateAlarm = async (row: any) => {
  if (row.people_confirm) {
    ElMessage.warning("告警已经确认");
    return;
  }
  row["update_time"] = getCurrentDate();
  row["people_confirm"] = true;

  const res: any = await updateAlarmRequest(row);
  if (res.code == 200) {
    ElMessage.success("告警确认成功");
  } else {
    ElMessage.error("告警确认失败");
  }
};

// 删除告警信息
const deletePlugin = async (params: Alarm.AlarmItem) => {
  await useHandleData(deleteAlarmRequest, { id: [params.id] }, `删除【${params.task_name}】告警`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: Alarm.AlarmResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Alarm.AlarmFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getAlarmRequest(newParams);
};

const columns = reactive<ColumnProps<Alarm.AlarmItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  {
    prop: "process_name",
    label: "流程名称",
    search: { el: "input" },
    width: 140
  },
  {
    prop: "process_instance_id",
    label: "流程实例ID",
    search: { el: "input" },
    width: 160
  },
  {
    prop: "task_name",
    label: "任务名称",
    search: { el: "input" },
    width: 140
  },
  {
    prop: "error_info",
    label: "异常信息",
    width: 120,
    render: () => {
      return (
        <el-button type="danger" link onClick={() => ElMessage.error("查看告警请点击Expand")}>
          {"任务异常"}
        </el-button>
      );
    }
  },
  {
    prop: "people_confirm",
    label: "是否确认",
    search: { el: "input" },
    width: 120,
    render: (scope: any) => {
      return (
        <el-tag type={scope.row.people_confirm ? "success" : "danger"}>
          {scope.row.people_confirm ? "确认" : "未确认"}
        </el-tag>
      );
    }
  },
  { prop: "creator_name", label: "处理人" },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
