<template>
  <el-card>
    <div :class="{ process_running: isRunning, process_config: !isRunning }">
      <h3>流程配置信息</h3>
      <el-form :model="processParams" label-width="100">
        <el-form-item label="setup">
          <el-select
            :disabled="isRunning"
            v-model="processParams.setup"
            placeholder="选择setup方法"
            clearable
            @change="updateProcessParam"
            style="width: 80%"
          >
            <el-option v-for="item in pluginOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="teardown">
          <el-select
            :disabled="isRunning"
            v-model="processParams.teardown"
            placeholder="选择teardown方法"
            clearable
            @change="updateProcessParam"
            style="width: 80%"
          >
            <el-option v-for="item in pluginOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="超时时间">
          <el-input
            :disabled="isRunning"
            v-model="processParams.timeout"
            placeholder="请输入超时时间"
            style="width: 80%"
            @change="updateProcessParam"
          >
            <template #append>秒</template>
          </el-input>
        </el-form-item>

        <el-form-item label="提示类型">
          <el-select
            :disabled="isRunning"
            v-model="processParams.notice_type"
            placeholder="选择提示类型"
            @change="updateProcessParam"
            style="width: 80%"
          >
            <el-option v-for="item in noticeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送邮件">
          <el-switch v-model="processParams.is_send" @change="updateProcessParam" :disabled="isRunning" />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script setup lang="ts" name="ProcessConfig">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { updateProcessParamRequest } from "@/api/flow/flowOperator/index";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import { ElMessage } from "element-plus";
import { BaseResponse, BaseUpdateResponse } from "@/api/interface/index";
import useFlowStatueStore from "@/stores/modules/flowStatue";
import { getSetupTearDownOptionRequest } from "@/api/option/index";
import { Option } from "@/api/option/type";
import { getProcessDetailRequest } from "@/api/orderlines/orderlinesManager/process/index";

const { isRunning } = storeToRefs(useFlowStatueStore());
const { process_id } = storeToRefs(useFlowStore());

const noticeOptions = [
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
const pluginOptions = ref<Option.OptionItem[]>([]);

let processParams = ref<Process.ProcessParamType>({
  setup: "",
  teardown: "",
  timeout: 2 * 60 * 60,
  notice_type: "FAILURE",
  is_send: true
});

onMounted(async () => {
  const response: BaseResponse<Process.ProcessItem> = await getProcessDetailRequest(process_id.value);
  if (response.code == 200 && response.data.process_params) {
    processParams.value = response.data.process_params;
  }
  await getSetupTeardownOption();
});

// 获取插件选项
const getSetupTeardownOption = async () => {
  const response: BaseResponse<Option.OptionResponse> = await getSetupTearDownOptionRequest();
  if (response.code == 200) {
    pluginOptions.value = Array.isArray(response.data) ? response.data : [];
  } else {
    ElMessage.error("获取插件选项失败");
  }
};

// 修改流程参数
const updateProcessParam = async () => {
  processParams.value.timeout = Number(processParams.value.timeout);
  const res: BaseUpdateResponse = await updateProcessParamRequest(processParams.value, process_id.value);
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
