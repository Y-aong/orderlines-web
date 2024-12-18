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
    >
      <template #expand="scope">
        <json-viewer :value="scope.row" copyable boxed sort expanded />
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getPrometheusInstanceRequest } from "@/api/alarm/alarmInstance/index";
import { ProTableInstance, ColumnProps, cardProps } from "@/components/ProTable/interface";
import { View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { cardLayoutProps } from "@/components/ProTable/interface";
import { PrometheusInstance } from "@/api/alarm/alarmInstance/type";
import "vue3-json-viewer/dist/index.css";
import { useRouter } from "vue-router";

const router = useRouter();
const isCard = ref<boolean>(true);
const proTable = ref<ProTableInstance>();
const openDrawer = (title: string, row: Partial<PrometheusInstance.PrometheusInstanceItem> = {}) => {
  router.push(`/alarm/metrics/${row.instance_name}`);
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: PrometheusInstance.PrometheusInstanceResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: PrometheusInstance.Filter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getPrometheusInstanceRequest(newParams);
};
const cardTitle = ref<string>("instance_name");

const cardColumn: cardProps[] = reactive<cardProps[]>([
  { label: "任务名称", value: "job_name" },
  { label: "监控实例", value: "instance_name" },
  { label: "任务状态", value: "job_status" },
  { label: "是否确认", value: "confirm" }
]);

const columns = reactive<ColumnProps<PrometheusInstance.PrometheusInstanceItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "Expand", width: 100 },
  { prop: "job_name", label: "任务名称", search: { el: "input" } },
  { prop: "instance_name", label: "监控实例", search: { el: "input" } },
  { prop: "job_status", label: "任务状态", search: { el: "input" } },
  {
    prop: "img_url",
    label: "监控对象",
    width: 120,
    render: (scope: any) => {
      if (scope.row && scope.row.img_url)
        return <el-image style="width: 40px; height: 40px;border-radius: 50%" src={scope.row.img_url} lazy />;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const cardLayout = ref<cardLayoutProps>({ xs: 24, sm: 24, md: 12, lg: 12, xl: 6, height: "220px", width: "100%" });
const initParam = reactive({ pageNum: 1, pageSize: 10 });
// 切换卡片布局
const changeCard = () => {
  isCard.value = !isCard.value;
};
</script>

<style lang="scss" scoped></style>
