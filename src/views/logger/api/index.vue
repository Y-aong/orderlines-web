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
        <el-button type="primary" link :icon="Delete" @click="deletePlugin(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getApiLoggerRequest, deleteApiLoggerRequest } from "@/api/logger/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import { Logger } from "@/api/logger/type";

const proTable = ref<ProTableInstance>();

// 删除日志信息
const deletePlugin = async (params: Logger.ApiLoggerItem) => {
  await useHandleData(deleteApiLoggerRequest, params.id, `删除【${params.api_path}】API日志`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: Logger.ApiLoggerResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Logger.ApiLoggerItem) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getApiLoggerRequest(newParams);
};

const columns = reactive<ColumnProps<Logger.ApiLoggerItem>[]>([
  {
    prop: "id",
    label: "序号",
    search: { el: "input" },
    width: 80
  },
  {
    prop: "api_path",
    label: "api路径",
    search: { el: "input" },
    width: 200
  },
  {
    prop: "method",
    label: "请求方法",
    search: { el: "input" },
    width: 160
  },
  {
    prop: "state",
    label: "日志等级",
    search: { el: "input" },
    width: 140
  },
  {
    prop: "visitor",
    label: "访问人",
    width: 120
  },
  {
    prop: "message",
    label: "日志内容",
    search: { el: "input" },
    width: 280
  },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
