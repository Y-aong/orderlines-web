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
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        <el-button
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
        <el-button type="primary" link :icon="Delete" @click="deleteJenkins(scope.row)">删除</el-button>
        <el-button type="primary" link :icon="VideoPlay" @click="deleteJenkins(scope.row)">jenkins构建</el-button>
      </template>
    </ProTable>
    <pluginDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>
<script setup lang="tsx">
import { reactive, ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { getJenkinsRequest, deleteJenkinsRequest, jenkinsExport } from "@/api/jenkins/jenkinsInfo/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, View, Download, VideoPlay } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import pluginDrawer from "./pluginDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { Jenkins } from "@/api/jenkins/jenkinsInfo/type";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof pluginDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Jenkins.JenkinsInfoItem> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 批量删除
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteJenkinsRequest, { id }, "删除所选角色信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 删除插件信息
const deleteJenkins = async (params: Jenkins.JenkinsInfoItem) => {
  await useHandleData(deleteJenkinsRequest, params.id, `删除【${params.name}】jenkins`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: Jenkins.JenkinsInfoResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: Jenkins.JenkinsInfoFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getJenkinsRequest(newParams);
};
// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出jenkins数据?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(jenkinsExport, "jenkins列表", proTable.value?.searchParam);
  });
};

const columns = reactive<ColumnProps<Jenkins.JenkinsInfoFilter>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "展开", width: 70 },
  {
    prop: "name",
    label: "jenkins名称",
    search: { el: "input" },
    width: 140
  },
  { prop: "description", label: "jenkins描述" },
  {
    prop: "url",
    label: "jenkins链接",
    search: { el: "input" },
    width: 160,
    render: (scope: any) => {
      const build_able_type = scope.row.build_able ? "primary" : "danger";

      return (
        <el-link type={build_able_type} href={scope.row.url}>
          jenkins链接
        </el-link>
      );
    }
  },
  {
    prop: "build_able",
    label: "是否可构建",
    search: { el: "input" },
    width: 120,
    render: (scope: any) => {
      const build_able = scope.row.build_able === true ? "可以构建" : "不可构建";
      const build_able_type = scope.row.build_able ? "success" : "danger";
      return <el-tag type={build_able_type}>{build_able}</el-tag>;
    }
  },
  {
    prop: "color",
    label: "jenkins状态",
    width: 120,
    render: (scope: any) => {
      const build_able = scope.row.color === "blue" ? "正常" : "异常";
      const build_able_type = scope.row.color === "blue" ? "success" : "danger";
      return <el-tag type={build_able_type}>{build_able}</el-tag>;
    }
  },
  { prop: "insert_time", label: "创建时间", width: 180 },
  { prop: "insert_time", label: "创建时间", width: 180 },
  { prop: "creator_name", label: "创建者" },
  { prop: "operation", label: "操作", fixed: "right", width: 280 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
