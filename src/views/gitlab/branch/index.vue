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
        <el-button type="primary" link :icon="Delete" @click="deleteItem(scope.row)">删除</el-button>
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
import { getGitlabBranchRequest, deleteGitlabBranchRequest, gitlabBranchExport } from "@/api/gitlab/branch/index";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import pluginDrawer from "./pluginDrawer.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { GitlabBranch } from "@/api/gitlab/branch/type";

const proTable = ref<ProTableInstance>();

// 新增，查看，编辑
const drawerRef = ref<InstanceType<typeof pluginDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<GitlabBranch.GitlabBranchItem> = {}) => {
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
  await useHandleData(deleteGitlabBranchRequest, { id }, "删除所选gitlab分支信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 删除插件信息
const deleteItem = async (params: GitlabBranch.GitlabBranchItem) => {
  await useHandleData(deleteGitlabBranchRequest, params.id, `删除【${params.branch_name}】分支`);
  proTable.value?.getTableList();
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

const dataCallback = (data: GitlabBranch.GitlabBranchResponse) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: GitlabBranch.GitlabBranchFilter) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getGitlabBranchRequest(newParams);
};
// 导出数据
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出Gitlab仓库?", "温馨提示", { type: "warning" }).then(() => {
    useDownload(gitlabBranchExport, "Gitlab仓库", proTable.value?.searchParam);
  });
};

const columns = reactive<ColumnProps<GitlabBranch.GitlabBranchItem>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "expand", label: "展开", width: 70 },
  { prop: "id", label: "ID", width: 60 },
  { prop: "project_id", label: "仓库ID", search: { el: "input" }, width: 80 },
  { prop: "project_name", label: "仓库名称", search: { el: "input" }, width: 120 },
  { prop: "branch_name", label: "分支名称", search: { el: "input" } },
  {
    prop: "is_default",
    label: "默认分支",
    width: 90,
    render: (scope: any) => {
      return <el-tag type={scope.row.is_default ? "primary" : "warning"}> {`${scope.row.is_default}`}</el-tag>;
    }
  },
  {
    prop: "protected",
    label: "保护分支",
    width: 90,
    render: (scope: any) => {
      return <el-tag type={scope.row.protected ? "primary" : "warning"}> {`${scope.row.protected}`}</el-tag>;
    }
  },
  {
    prop: "can_push",
    label: "可以推送",
    width: 90,
    render: (scope: any) => {
      return <el-tag type={scope.row.can_push ? "primary" : "warning"}> {`${scope.row.can_push}`}</el-tag>;
    }
  },
  { prop: "insert_time", label: "创建时间" },
  { prop: "update_time", label: "修改时间" },
  {
    prop: "project_url",
    label: "仓库链接",
    search: { el: "input" },
    width: 100,
    render: (scope: any) => {
      return (
        <el-link type="primary" href={scope.row.project_url}>
          仓库链接
        </el-link>
      );
    }
  },
  {
    prop: "branch_url",
    label: "分支链接",
    search: { el: "input" },
    width: 100,
    render: (scope: any) => {
      return (
        <el-link type="primary" href={scope.row.branch_url}>
          分支链接
        </el-link>
      );
    }
  },

  { prop: "operation", label: "操作", fixed: "right", width: 200 }
]);

const initParam = reactive({ pageNum: 1, pageSize: 10 });
</script>

<style lang="scss" scoped></style>
@/api/orderlines/process/index
