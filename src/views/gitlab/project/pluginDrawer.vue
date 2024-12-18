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
      <el-form-item label="仓库描述" prop="description" clearable>
        <el-input v-model="drawerProps.row!.description" placeholder="请填写仓库描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="可见性" prop="visibility" clearable>
        <el-input v-model="drawerProps.row!.visibility" placeholder="请填写可见性" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="create_time" clearable>
        <el-input v-model="drawerProps.row!.create_time" placeholder="请填写创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item label="拥有者名称" prop="owner_name" clearable>
        <el-input v-model="drawerProps.row!.owner_name" placeholder="请填写拥有者名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="仓库链接" prop="project_url" clearable>
        <el-input v-model="drawerProps.row!.project_url" placeholder="请填写仓库链接" clearable></el-input>
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
