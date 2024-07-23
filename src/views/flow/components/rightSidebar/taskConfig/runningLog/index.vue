<template>
  <div>
    <el-collapse-item title="任务运行日志" name="runningLog">
      <template v-for="(item, index) in runningTask" :key="index">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>
                任务名称: <el-tag>{{ item.task_name }}</el-tag>
                &nbsp;
                <el-tag type="success">{{ item.task_status }}</el-tag>
              </span>

              <div>
                <el-button
                  v-if="JSON.stringify(item.task_result) !== '{}'"
                  size="small"
                  icon="View"
                  type="primary"
                  circle
                  @click="check('查看任务结果', item.task_result)"
                />

                <el-button
                  v-if="JSON.stringify(item.task_error_info) !== '{}'"
                  size="small"
                  icon="BellFilled"
                  type="warning"
                  circle
                  @click="check('查看任务异常', item.task_error_info)"
                />
              </div>
            </div>
          </template>
          <div class="card-context">
            <div>
              <el-button size="small" type="primary" @click="check('查看任务参数', item.method_kwargs)">
                查看参数
              </el-button>
              <el-button size="small" type="danger" @click="check('查看任务配置', item.task_config)">
                查看配置
              </el-button>
            </div>
            <div>开始时间：{{ item.start_time }}</div>
            <div>结束时间：{{ item.end_time }}</div>
          </div>
        </el-card>
      </template>
    </el-collapse-item>
    <el-dialog :title="title" width="80%" v-model="dialogVisible">
      <json-viewer :value="taskResultError" copyable boxed sort expanded :expand-depth="depth" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import useRunningTaskStore from "@/stores/modules/runningTask";

import "vue3-json-viewer/dist/index.css";

const { runningTask } = storeToRefs(useRunningTaskStore());
const depth = ref<number>(5);
const dialogVisible = ref<boolean>(false);
let title = ref<string>("查看任务结果");
let taskResultError = reactive({});

const check = (type: string, row: any) => {
  title.value = type;
  dialogVisible.value = true;
  if (typeof row === "string") {
    row = JSON.parse(row);
  }
  taskResultError = row;
};
</script>
<script lang="ts">
export default {
  name: "TaskResultParam"
};
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
}
.card-context {
  font-size: 14px;
  line-height: 32px;
}
.box-card {
  width: 100%;
  height: 100%;
}
</style>
