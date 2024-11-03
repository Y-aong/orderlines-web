<template>
  <div>
    <el-table :data="nodeParam" max-height="65vh" stripe show-header style="width: 100%">
      <el-table-column fixed prop="desc" label="参数名" min-width="80" />
      <el-table-column prop="value" label="参数值" min-width="240" required>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-text truncated>{{ scope.row.task_id }}</el-text>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" name="Parallel" setup>
import { storeToRefs } from "pinia";
import useGraphStore from "@/stores/modules/graph";

const { nodeParam } = storeToRefs(useGraphStore());
</script>

<style scoped></style>
