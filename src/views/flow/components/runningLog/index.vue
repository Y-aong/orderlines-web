<template>
  <div>
    <el-card :class="{ running_log: isRunning, config_log: !isRunning }">
      <el-descriptions title="流程运行日志" :column="column" size="small" direction="vertical" border>
        <el-descriptions-item label="任务状态" align="center" min-width="100px">
          <el-tag size="small" :type="taskStatus.valueOf() === '运行成功' ? 'success' : 'danger'">
            {{ taskStatus.valueOf() }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="运行结果" v-if="taskStatus.valueOf() === '运行成功'">
          <el-col :span="spanLength">
            <el-text style="vertical-align: middle" truncated type="success" @click="checkTaskResult">
              {{ taskResult.valueOf() }}
            </el-text>
          </el-col>
        </el-descriptions-item>
        <el-descriptions-item label="运行异常" v-if="taskStatus.valueOf() === '运行失败'" @click="checkTaskResult">
          <el-col :span="spanLength">
            <el-text style="vertical-align: middle" truncated type="danger" @click="checkTaskResult">
              {{ taskErrorInfo.valueOf() }}
            </el-text>
          </el-col>
        </el-descriptions-item>
        <el-descriptions-item label="运行方式" align="center">
          <el-tag size="small">手动运行</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="运行进度">
          <el-tag size="small" @click="checkTaskProgress"> 80%</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!--任务结果-->
    <el-dialog v-model="taskResultVisible" :title="taskStatus.valueOf() === '运行成功' ? '任务结果信息' : '任务异常信息'">
      <template v-if="taskStatus.valueOf() === '运行成功'">
        <json-viewer :value="taskResultORError" copyable boxed sort></json-viewer>
      </template>
      <template v-if="taskStatus.valueOf() === '运行失败'">
        <json-viewer :value="taskResultORError" copyable boxed sort></json-viewer>
      </template>
    </el-dialog>
    <!--任务进度-->
    <el-dialog v-model="taskProgressVisible" title="任务进度">
      <el-steps :active="taskProgressActive" finish-status="success">
        <el-step title="开始节点" />
        <el-step title="任务节点1" />
        <el-step title="结束节点" />
      </el-steps>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="runningLog">
import { reactive, ref } from "vue";
import "vue3-json-viewer/dist/index.css";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";

let { isRunning } = storeToRefs(useFlowStore());

const column = ref<number>(2);
const spanLength = ref<number>(8);
const taskStatus = ref<string>("运行成功");
const taskResult = {
  task_status: "SUCCESS",
  msg: "运行信息"
};

const taskErrorInfo = {
  task_status: "FAILURE",
  msg: "运行信息"
};

const taskResultORError = taskStatus.value === "运行成功" ? reactive(taskResult) : reactive(taskErrorInfo);

let taskResultVisible = ref<boolean>(false);
let taskProgressVisible = ref<boolean>(false);
let taskProgressActive = ref<any>(true);

const checkTaskResult = () => {
  taskResultVisible.value = !taskResultVisible.value;
};

const checkTaskProgress = () => {
  taskProgressVisible.value = !taskProgressVisible.value;
};
</script>
<script lang="ts">
export default {
  name: "RunningLog"
};
</script>

<style scoped>
.running_log {
  position: fixed;
  top: 80vh;
  left: 77%;
  width: 100%;
  height: 20vh;
  background: #ffffff;
}
.config_log {
  position: fixed;
  top: 100vh;
  left: 77%;
  width: 100%;
  height: 0;
  background: #ffffff;
}
</style>
