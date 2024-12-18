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
      <el-form-item label="jenkins名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写jenkins名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="jenkins参数" prop="parameter" clearable>
        <el-table :data="drawerProps.row!.parameter" show-header size="small" align="center" border style="width: 100%">
          <el-table-column prop="param_name" label="名称" min-width="60" show-overflow-tooltip />
          <el-table-column prop="default_value" label="默认值" min-width="50" show-overflow-tooltip />
          <el-table-column prop="param_desc" label="描述" show-overflow-tooltip />
          <el-table-column prop="param_type" label="类型" min-width="60" show-overflow-tooltip />
        </el-table>
      </el-form-item>
      <el-form-item label="jenkins链接" prop="url">
        <el-input v-model="drawerProps.row!.url" placeholder="请填写jenkins链接" clearable></el-input>
      </el-form-item>

      <el-form-item label="jenkins描述" prop="description" clearable>
        <el-input v-model="drawerProps.row!.description" placeholder="请填写jenkins描述" clearable></el-input>
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
