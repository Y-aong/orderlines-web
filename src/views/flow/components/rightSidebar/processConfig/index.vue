<template>
  <el-card>
    <div :class="{ process_running: isRunning, process_config: !isRunning }">
      <h3>流程配置信息</h3>
      <el-form :model="processParam" label-width="100">
        <el-form-item label="超时时间">
          <el-input
            v-model="processParam.timeout"
            placeholder="请输入超时时间"
            style="width: 80%"
            @change="updateProcessParam"
          >
            <template #append>秒</template>
          </el-input>
        </el-form-item>

        <el-form-item label="提示类型">
          <el-select
            v-model="processParam.notice_type"
            placeholder="选择提示类型"
            @change="updateProcessParam"
            style="width: 80%"
          >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送邮件">
          <el-switch v-model="processParam.is_send" @change="updateProcessParam" />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script setup lang="ts" name="ProcessConfig">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { updateProcessParamRequest } from "@/api/flow/flowOperator/index";
import { ElMessage } from "element-plus";
import { BaseUpdateResponse } from "@/api/interface/index";
import useFlowStatueStore from "@/stores/modules/flowStatue";
const { isRunning } = storeToRefs(useFlowStatueStore());
const { process_id } = storeToRefs(useFlowStore());

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

interface ProcessParamType {
  timeout: number;
  notice_type: string;
  is_send: boolean;
  process_id: string;
}

let processParam = ref<ProcessParamType>({
  timeout: 2 * 60 * 60,
  notice_type: "FAILURE",
  is_send: true,
  process_id: process_id.value
});

// 修改流程参数
const updateProcessParam = async () => {
  processParam.value.timeout = Number(processParam.value.timeout);
  const res: BaseUpdateResponse = await updateProcessParamRequest(processParam.value);
  if (res.code === 200) {
    ElMessage.success(res.message);
  }
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
