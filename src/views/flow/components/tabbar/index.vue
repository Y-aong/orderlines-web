<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <LOGO></LOGO>
    </div>
    <div class="tabbar_right">
      <div class="process_info">
        <span style="font-size: 15px; font-weight: bold"> 流程名称：</span>
        <el-tag>{{ process_name }}</el-tag>
        &nbsp;
        <el-button v-if="!isRunning && !isSave" size="small" type="primary" @click="getProcessVersion">
          创建版本
        </el-button>
      </div>

      <div class="process_operate">
        <template v-if="isSave">
          <el-popconfirm
            width="220"
            confirm-button-text="启动"
            cancel-button-text="不启动"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否确定启动?"
            @confirm="startProcess"
          >
            <template #reference>
              <el-button v-if="!isRunning && isSave" size="small" type="success"> 启动 </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            width="220"
            confirm-button-text="重启"
            cancel-button-text="不重启"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否确定重启?"
            @confirm="startProcess"
          >
            <template #reference>
              <el-button v-if="isRunning" size="small" type="success"> 重启 </el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="isRunning" size="small" type="danger" @click="stopProcess">停止 </el-button>
          <el-button v-if="isRunning" size="small" type="warning" @click="pausedProcess">暂停 </el-button>
          <el-button v-if="isRunning" size="small" type="primary" @click="recoverProcess">继续 </el-button>
        </template>
        <el-button size="small" type="primary" @click="saveProcess"> {{ isSave ? "编辑" : "保存" }}</el-button>
        <el-button v-if="isRedirect" size="small" type="success" @click="runningStatus"> 状态 </el-button>
        <el-select
          v-if="!isRunning && !isSave"
          v-model="process_version"
          placeholder="选择版本"
          style="width: 120px; margin-left: 15px"
          @change="changeProcessVersion"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
  </div>
  <el-dialog title="创建流程版本" width="50%" v-model="versionVisible" append-to-body>
    <el-form :model="versionForm" label-width="120px">
      <el-form-item label="流程版本">
        <el-input v-model="versionForm.version" placeholder="请输入流程版本" />
      </el-form-item>
      <el-form-item label="版本描述">
        <el-input v-model="versionForm.version_desc" placeholder="请输入版本描述" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="versionVisible = false">取消</el-button>
        <el-button type="primary" @click="createProcessVersion"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "FlowTabbar"
};
</script>

<script setup lang="ts">
import LOGO from "./logo/index.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { InfoFilled } from "@element-plus/icons-vue";
import {
  pausedProcessRequest,
  recoverProcessRequest,
  startProcessRequest,
  stopProcessRequest
} from "@/api/flow/operate";
import {
  getRunningTaskRequest,
  saveFlowRequest,
  getProcessVersionOptionRequest,
  createProcessVersionRequest,
  getProcessVersionRequest
} from "@/api/flow/taskNode/index";
import { ProcessVersionOptionType, ProcessVersionType } from "@/api/flow/taskNode/type";
import { ElMessage } from "element-plus";
import { setStorage } from "@/utils/storage";

let { process_id, process_instance_id, process_name, process_version, isSave, isRunning, runningTask, isRedirect } =
  storeToRefs(useFlowStore());

let options = ref<ProcessVersionOptionType[]>([]);
let versionVisible = ref<boolean>(false);
let versionForm = ref<ProcessVersionType>({
  process_id: process_id.value as string,
  version: "",
  version_desc: ""
});

onMounted(async () => {
  await getProcessVersionOption();
});

const getProcessVersionOption = async () => {
  const res = await getProcessVersionOptionRequest(process_name.value);
  options.value = res.data;
};

//获取版本描述
const getProcessVersion = async () => {
  versionVisible.value = true;
  let res: any = await getProcessVersionRequest(process_id.value);
  versionForm.value = res.data;
};

//创建流程版本
const createProcessVersion = async () => {
  versionVisible.value = false;
  let res: any = await createProcessVersionRequest(versionForm.value);
  if (res.code == 200) {
    process_id.value = process_version.value;
    process_version.value = process_version.value;
    setStorage(res.data.process_id, "PROCESS_ID");
    setStorage(res.data.process_id, "PROCESS_VERSION");
    await getProcessVersionOption();
    window.location.reload();
  }
};

const changeProcessVersion = async () => {
  console.log(process_version.value);
  process_id.value = process_version.value;
  process_version.value = process_version.value;
  setStorage(process_version.value, "PROCESS_ID");
  setStorage(process_version.value, "PROCESS_VERSION");
  isRunning.value = false;
  window.location.reload();
};

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
  const RunningTaskFilter = {
    process_id: process_id.value,
    process_instance_id: process_instance_id.value
  };
  let res: any = await getRunningTaskRequest(RunningTaskFilter);
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
    const response: any = await saveFlowRequest({ process_id: process_id.value });
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
