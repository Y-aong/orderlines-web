<template>
  <div class="flow_tabbar">
    <FlowTabbar />
  </div>

  <div class="container">
    <template v-if="isRunning">
      <FlowRunning />
    </template>
    <template v-if="!isRunning">
      <FLOW />
    </template>
  </div>
  <div :class="{ running_right: isRunning, config_right: !isRunning }">
    <FlowRightSidebar></FlowRightSidebar>
  </div>
  <div :class="{ running_bottom: isRunning, config_bottom: !isRunning }">
    <RunningLog />
  </div>

  <el-dialog v-model="dialogFormVisible" title="流程配置创建">
    <el-form style="width: 80%" :model="ProcessItem" ref="formRef">
      <el-form-item label="流程名称" prop="process_name">
        <el-input placeholder="请输入流程名称" v-model="ProcessItem.process_name"> </el-input>
      </el-form-item>
      <el-form-item label="流程描述" prop="desc">
        <el-input placeholder="请输入流程描述" v-model="ProcessItem.desc"> </el-input>
      </el-form-item>
      <el-form-item label="流程配置" prop="process_config">
        <el-input placeholder="请输入流程配置" v-model="ProcessItem.process_config"> </el-input>
      </el-form-item>
      <el-form-item label="流程参数" prop="process_params">
        <el-input placeholder="请输入流程参数" v-model="ProcessItem.process_params"> </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="cancel"> 取消 </el-button>
      <el-button type="primary" size="default" @click="confirm"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "FlowPanel"
};
</script>

<script setup lang="ts">
import FLOW from "@/components/Flow/index.vue";
import FlowRunning from "@/components/Flow/flow_running/index.vue";
import FlowTabbar from "./tabbar/index.vue";
import FlowRightSidebar from "./rightSidebar/index.vue";
import RunningLog from "./runningLog/index.vue";
import { onMounted, reactive, ref } from "vue";
import { v4 as uuid4 } from "uuid";

import { createProcessRequest } from "@/api/orderlines/process/index";
import { ElMessage } from "element-plus";
import useFlowStore from "@/stores/modules/flow";
import { storeToRefs } from "pinia";
import { setStorage } from "@/utils/storage";
import { Process } from "@/api/orderlines/process/type";
let { isRunning, process_name, process_id } = storeToRefs(useFlowStore());
let dialogFormVisible = ref<boolean>(false);

onMounted(async () => {
  isRunning.value = false;
  if (!process_name.value) {
    dialogFormVisible.value = true;
  }
});

let ProcessItem = reactive<Process.ProcessItem>({
  process_id: "",
  process_name: "",
  creator: "",
  desc: "",
  process_config: "",
  process_params: "",
  update_time: "",
  updater: ""
});

const confirm = async () => {
  let requestData: Process.ProcessItem = {
    process_id: uuid4(),
    process_name: ProcessItem.process_name,
    desc: ProcessItem.desc,
    process_params: ProcessItem.process_params,
    process_config: ProcessItem.process_config
  };
  setStorage(requestData.process_id, "PROCESS_ID");
  setStorage(ProcessItem.process_name, "PROCESS_NAME");
  let res: any = await createProcessRequest(requestData);
  if (res.code == 200) {
    dialogFormVisible.value = false;
    ElMessage({
      type: "success",
      message: "添加流程配置成功"
    });
    process_name.value = requestData.process_name;
    process_id.value = requestData.process_id;
    localStorage.setItem("PROCESS_ID", requestData.process_id as string);
    localStorage.setItem("PROCESS_NAME", requestData.process_name as string);
  } else {
    ElMessage({
      type: "error",
      message: res.message
    });
  }
};

//对话框底部取消按钮
const cancel = () => {
  //对话框隐藏
  dialogFormVisible.value = false;
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 60px;
  left: 0;
  width: 77%;
  height: 100vh;
}
.flow_tabbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
}
.running_right {
  position: fixed;
  top: 0;
  left: 77%;
  width: 23%;
  height: 80vh;
  background-color: #fdfdfd;
}
.config_right {
  position: fixed;
  top: 0;
  left: 77%;
  width: 23%;
  height: 100vh;
  background-color: #fdfdfd;
}
.running_bottom {
  position: fixed;
  top: 80vh;
  left: 77%;
  width: 23%;
  height: 20vh;
  background-color: #ffffff;
}
.config_bottom {
  position: fixed;
  top: 100vh;
  left: 77%;
  width: 23%;
  height: 0;
  background-color: #ffffff;
}
</style>
@/api/orderlines/process/type@/api/orderlines/process/index
