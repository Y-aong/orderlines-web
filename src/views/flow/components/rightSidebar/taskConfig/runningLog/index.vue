<template>
  <div>
    <el-collapse-item title="任务运行日志" name="runningLog">
      <template v-for="(item, index) in runningTask" :key="index">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>
                任务名称: <el-tag>{{ item.task_name }}</el-tag>
              </span>

              <div>
                <el-tooltip content="点击查看任务结果" placement="top">
                  <el-button
                    v-if="JSON.stringify(item.task_result) !== '{}'"
                    size="small"
                    icon="View"
                    type="primary"
                    circle
                    @click="check('查看任务结果', item.task_result)"
                  />
                </el-tooltip>

                <el-tooltip content="点击查看任务异常" placement="top">
                  <el-button
                    v-if="JSON.stringify(item.task_error_info) !== '{}'"
                    size="small"
                    icon="BellFilled"
                    type="warning"
                    circle
                    @click="check('查看任务异常', item.task_error_info)"
                  />
                </el-tooltip>
              </div>
            </div>
          </template>
          <div class="card-context">
            <div>
              任务状态：<el-tag>{{ item.task_status }}</el-tag>
            </div>
            <div @click="check('查看任务参数', item.method_kwargs)">
              任务参数：<el-button size="small">点击查看</el-button>
            </div>
            <div @click="check('查看任务配置', item.task_config)">
              任务配置：<el-button size="small">点击查看</el-button>
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
import useFlowStore from "@/stores/modules/flow";
import "vue3-json-viewer/dist/index.css";

const { runningTask } = storeToRefs(useFlowStore());
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
  font-size: 16px;
  font-weight: bold;
}
.card-context {
  font-size: 14px;
  line-height: 35px;
}
.box-card {
  width: 100%;
  height: 100%;
}
</style>
