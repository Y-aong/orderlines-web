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
      <el-form-item label="提交ID" prop="commit_id">
        <el-input v-model="drawerProps.row!.commit_id" placeholder="请填写提交ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交标题" prop="commit_title">
        <el-input v-model="drawerProps.row!.commit_title" placeholder="请填写提交标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交信息" prop="commit_message">
        <el-input v-model="drawerProps.row!.commit_message" placeholder="请填写提交信息" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交人" prop="author_name">
        <el-input v-model="drawerProps.row!.author_name" placeholder="请填写提交人" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交时间" prop="created_at">
        <el-input v-model="drawerProps.row!.created_at" placeholder="请填写提交时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="提交链接" prop="commit_url">
        <el-input v-model="drawerProps.row!.commit_url" placeholder="请填写提交链接" clearable></el-input>
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
