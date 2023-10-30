<template>
  <div>
    <el-table :data="taskGroup" border stripe style="width: 100%">
      <el-table-column prop="task_name" label="任务组子任务" width="120" align="center" />
      <el-table-column label="任务id" min_width="240" align="center">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-text truncated>{{ scope.row.task_id }}</el-text>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="TaskGroup">
import { storeToRefs } from "pinia";

import useTaskGroupStore from "@/stores/modules/taskGroup";
let { taskGroup } = storeToRefs(useTaskGroupStore());
</script>

<style scoped></style>
