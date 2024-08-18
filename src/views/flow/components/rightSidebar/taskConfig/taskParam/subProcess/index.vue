<template>
  <div>
    {{ nodeParam }}
    <el-form label-width="auto" style="max-width: 600px">
      <el-form-item label="子流程名称:">
        <el-select v-model="form.region" placeholder="请选择子流程名称">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="子流程参数:">
        <el-button @click="getParamType">点击设置参数</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="输入参数——请点击修改" v-model="form.delivery">
      <el-table :data="variables" style="width: 100%" @cell-click="handleCellClick" border>
        <el-table-column prop="name" label="变量名称" width="180">
          <template #default="{ row }">
            <span v-if="!isEditing[row.id]">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="变量值" width="180">
          <template #default="{ row }">
            <span v-if="!isEditing[row.id]">{{ row.value }}</span>
            <el-input v-else v-model="row.value" @blur="handleEdit(row, 'value')" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="变量类型" width="180">
          <template #default="{ row }">
            <span v-if="!isEditing[row.id]">{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="变量描述">
          <template #default="{ row }">
            <span v-if="!isEditing[row.id]">{{ row.description }}</span>
            <el-input v-else v-model="row.description" @blur="handleEdit(row, 'description')" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="SubProcess">
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { ElMessage } from "element-plus";
const isEditing = ref<any>({});

const handleCellClick = (row: any, column: any) => {
  if (["name", "value", "type", "description"].includes(column.property)) {
    isEditing.value[row.id] = true;
  }
};
const handleEdit = (row: any, property: string) => {
  delete isEditing.value[row.id];
  ElMessage.success(`更新成功: ${property} 的新值为 ${row[property]}`);
};
const variables = ref([
  { name: "var1", value: "10", type: "number", description: "A number variable" },
  { name: "var2", value: "true", type: "boolean", description: "A boolean variable" },
  { name: "var3", value: "hello", type: "string", description: "A string variable" }
]);

const { nodeParam } = storeToRefs(useFlowStore());

const getParamType = () => {
  console.log("labelPosition", form.delivery);
  form.delivery = !form.delivery;
};
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});
</script>

<style scoped>
.tooltip-base-box .center {
  justify-content: center;
}
</style>
