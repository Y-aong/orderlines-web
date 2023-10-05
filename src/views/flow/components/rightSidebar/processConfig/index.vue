<template>
  <el-card>
    <div :class="{ process_running: isRunning, process_config: !isRunning }">
      <h3>流程配置信息</h3>
      <el-form-item label="超时时间">
        <el-input autosize placeholder="请输入超时时间" style="width: 80%" />
      </el-form-item>

      <el-form-item label="提示类型">
        <el-select v-model="notice_type" placeholder="选择提示类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发送邮件">
        <el-switch v-model="isSend" />
      </el-form-item>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";

let { isRunning } = storeToRefs(useFlowStore());

const isSend = ref<boolean>(true);
const notice_type = ref("运行失败");
const options = [
  {
    label: "运行成功",
    value: "SUCCESS"
  },
  {
    label: "运行失败",
    value: "FAILURE"
  },
  {
    label: "运行停止",
    value: "TIMEOUT"
  },
  {
    label: "运行重试",
    value: "RETRY"
  },
  {
    label: "运行跳过",
    value: "SKIP"
  }
];
</script>

<script lang="ts">
export default {
  name: "ProcessConfig"
};
</script>

<style scoped>
.process_config {
  width: 100%;
  height: 100vh;
  background: #ffffff;
}
.process_running {
  width: 100%;
  height: 75vh;
  background: #ffffff;
}
</style>
