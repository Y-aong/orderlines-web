<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}插件`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <template v-if="drawerProps.title === '查看'">
        <el-form-item label="id" prop="id">
          <el-input v-model="drawerProps.row!.id" clearable></el-input>
        </el-form-item>
      </template>
      <el-form-item label="仓库ID" prop="project_id">
        <el-input v-model="drawerProps.row!.project_id" placeholder="请填写仓库ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="仓库名称" prop="project_name">
        <el-input v-model="drawerProps.row!.project_name" placeholder="请填写仓库名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="分支名称" prop="branch_name" clearable>
        <el-input v-model="drawerProps.row!.branch_name" placeholder="请填写分支名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="默认分支" prop="is_default" clearable>
        <el-input v-model="drawerProps.row!.is_default" placeholder="请填写默认分支" clearable></el-input>
      </el-form-item>
      <el-form-item label="保护分支" prop="protected" clearable>
        <el-input v-model="drawerProps.row!.protected" placeholder="请填写保护分支" clearable></el-input>
      </el-form-item>
      <el-form-item label="可以推送" prop="can_push" clearable>
        <el-input v-model="drawerProps.row!.can_push" placeholder="请填写可以推送" clearable></el-input>
      </el-form-item>
      <el-form-item label="仓库链接" prop="project_url">
        <el-input v-model="drawerProps.row!.project_url" placeholder="请填写仓库链接" clearable></el-input>
      </el-form-item>
      <el-form-item label="分支链接" prop="branch_url" clearable>
        <el-input v-model="drawerProps.row!.branch_url" placeholder="请填写分支链接" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="taskInstanceDrawer">
import { ref } from "vue";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

defineExpose({
  acceptParams
});
</script>
<style scoped>
.el-table__body-wrapper .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-table__body-wrapper .cell:hover {
  overflow: visible;
  white-space: normal;
}
</style>
