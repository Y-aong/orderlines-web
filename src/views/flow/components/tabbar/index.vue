<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <LOGO></LOGO>
    </div>
    <div class="tabbar_right">
      <div class="process_info">
        <span style="font-size: 15px; font-weight: bold"> 流程名称：</span>
        <el-tag>{{ process_name }}</el-tag>
      </div>

      <div class="process_operate">
        <template v-if="isSave">
          <el-button v-if="!isRunning && isSave" size="small" type="success" @click="startProcess"> 启动 </el-button>
          <el-button v-if="isRunning" size="small" type="danger" @click="stopProcess">停止 </el-button>
          <el-button v-if="isRunning" size="small" type="warning" @click="pausedProcess">暂停 </el-button>
          <el-button v-if="isRunning" size="small" type="primary" @click="recoverProcess">继续 </el-button>
        </template>
        <el-button size="small" type="primary" @click="saveProcess">
          {{ isSave ? "编辑" : "保存" }}
        </el-button>

        <el-button v-if="isRedirect" size="small" type="success" @click="runningStatus"> 状态 </el-button>

        <el-select v-model="value" clearable placeholder="选择版本" style="width: 100px; margin-left: 15px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "FlowTabbar"
};
</script>

<script setup lang="ts">
import LOGO from "./logo/index.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import {
  pausedProcessRequest,
  recoverProcessRequest,
  startProcessRequest,
  stopProcessRequest
} from "@/api/flow/operate";
import { getRunningEdgeRequest, saveFlowRequest } from "@/api/flow/taskNode/index";

import { ElMessage } from "element-plus";
import { setStorage } from "@/utils/storage";

let { process_id, process_instance_id, process_name, isSave, isRunning, runningTask, isRedirect } = storeToRefs(
  useFlowStore()
);

const value = ref("Option1");
const options = [
  {
    value: "Option1",
    label: "版本1"
  },
  {
    value: "Option2",
    label: "版本2"
  },
  {
    value: "Option3",
    label: "版本3"
  },
  {
    value: "Option4",
    label: "版本4"
  },
  {
    value: "Option5",
    label: "版本5"
  }
];

const runningStatus = () => {
  isRunning.value = true;
  isRedirect.value = false;
  isSave.value = true;
};

const startProcess = async () => {
  const result: any = await startProcessRequest(process_id.value);
  process_instance_id.value = result.data;
  if (result.code == 200) {
    ElMessage.success("流程启动成功");
    isRunning.value = true;
    setStorage(true, "IS_RUNNING");
    await getRunningTask();
  } else {
    ElMessage.error("流程启动失败");
  }
};

const getRunningTask = async () => {
  const RunningEdgeFilter = {
    process_id: process_id.value,
    process_instance_id: process_instance_id.value
  };
  let res: any = await getRunningEdgeRequest(RunningEdgeFilter);
  if (res.code === 200 && res.data.running_task != null) {
    runningTask.value = res.data.running_task;
  }
  return res.code === 200 ? res.data.running_edge : [];
};

const stopProcess = async () => {
  let result: any = await stopProcessRequest(process_id.value);
  if (result.code == 200) {
    ElMessage.success("流程停止成功");
  } else {
    ElMessage.error("流程停止失败" + result.message);
  }
};

const pausedProcess = async () => {
  let result: any = await pausedProcessRequest(process_id.value);
  if (result.code === 200) {
    ElMessage.success("流程暂停成功");
  } else {
    ElMessage.error("流程暂停失败" + result.message);
  }
};

const recoverProcess = async () => {
  let result: any = await recoverProcessRequest(process_id.value);
  if (result.code == 200) {
    ElMessage.success("流程恢复成功");
  } else {
    ElMessage.error("流程恢复失败" + result.message);
  }
};

const saveProcess = async () => {
  if (isSave.value) {
    ElMessage.success("流程开始编辑！");
    isSave.value = false;
    isRunning.value = false;
  } else {
    const saveFlowRequestData = {
      process_id: process_id.value
    };
    const response: any = await saveFlowRequest(saveFlowRequestData);
    if (response.code === 200) {
      isSave.value = true;
      setStorage(true, "IS_SAVE");
      ElMessage.success("流程保存成功！");
      isRunning.value = false;
      isSave.value = true;
    } else {
      ElMessage.error("流程保存失败！");
    }
  }
};
</script>

<style scoped>
.tabbar {
  display: flex;
  justify-content: space-between;
  width: 75%;
  height: 100%;
}
.tabbar_left {
  display: flex;
  align-items: center;
  margin-left: 30px;
}
.tabbar_right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-right: 30px;
}
.process_info {
  display: flex;
  align-items: center;
  margin-left: 30px;
}
.process_operate {
  display: flex;
  align-items: center;
}
</style>
