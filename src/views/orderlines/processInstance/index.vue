<template>
  <div>
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
    </ProTable>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getProcessRequest } from "@/api/process/index";
import { ProTableInstance } from "@/components/ProTable/interface";

const proTable = ref<ProTableInstance>();

const dataCallback = (data: any) => {
  console.log("data", data);
  return {
    list: data.items,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = async (params: any) => {
  console.log("params", params);
  let newParams = { pageNum: 1, pageSize: 10 };
  console.log("params", newParams);
  return await getProcessRequest(newParams);
};

const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  { prop: "process_id", label: "流程id" },
  { prop: "process_name", label: "流程名称" },
  { prop: "insert_time", label: "插入时间" },
  { prop: "update_time", label: "更新时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
