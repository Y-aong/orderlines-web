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
          版本操作
        </el-button>
        &nbsp;
        <el-switch
          v-if="!isRunning && !isSave"
          v-model="debugMode"
          type="primary"
          inline-prompt
          active-text="DEBUG"
          inactive-text="RUN"
          @click="changeProcessMode"
        />
      </div>

      <div class="process_operate">
        <template v-if="isSave">
          <el-popconfirm
            v-if="!isRunning && isSave"
            width="220"
            confirm-button-text="启动"
            cancel-button-text="不启动"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否确定启动?"
            @confirm="startProcess"
          >
            <template #reference>
              <el-button size="small" type="success"> 启动 </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            v-if="isRunning"
            width="220"
            confirm-button-text="重启"
            cancel-button-text="不重启"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否确定重启?"
            @confirm="startProcess"
          >
            <template #reference>
              <el-button size="small" type="success"> 重启 </el-button>
            </template>
          </el-popconfirm>
          <el-button size="small" type="danger" @click="stopProcess" v-if="isRunning">停止 </el-button>
          <el-button size="small" type="warning" @click="pausedProcess" v-if="isRunning">暂停 </el-button>
          <el-button size="small" type="primary" @click="recoverProcess" v-if="isRunning">继续 </el-button>
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

  <el-dialog title="版本操作" width="50%" v-model="versionVisible" append-to-body lock-scroll>
    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="创建版本" name="create">
        <el-form :model="versionForm" label-width="120px" style="height: 400px">
          <el-form-item label="流程版本" required>
            <el-input v-model="versionForm.version" placeholder="请输入流程版本" />
          </el-form-item>
          <el-form-item label="版本描述">
            <el-input v-model="versionForm.version_desc" placeholder="请输入版本描述" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="删除版本" name="delete">
        <el-table :data="versionData" style="width: 100%" max-height="400">
          <el-table-column fixed prop="id" label="ID" min-width="30" />
          <el-table-column fixed prop="process_name" label="流程名称" min-width="100" />
          <el-table-column fixed prop="version" label="版本名称" min-width="100" />
          <el-table-column prop="version_desc" label="版本描述" min-width="120" />
          <el-table-column fixed="right" label="操作" min-width="120" align="center">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteProcessVersion(scope.row.id)"> 删除版本 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

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
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import { InfoFilled } from "@element-plus/icons-vue";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import {
  pausedProcessRequest,
  recoverProcessRequest,
  startProcessRequest,
  stopProcessRequest
} from "@/api/orderlines/orderlinesOperate";
import {
  saveFlowRequest,
  createProcessVersionRequest,
  getProcessVersionRequest,
  getProcessVersionByNameRequest
} from "@/api/flow/taskNode/index";
import { ProcessVersionOptionType, ProcessVersionType } from "@/api/flow/taskNode/type";
import { ElMessage } from "element-plus";
import { setStorage } from "@/utils/storage";
import {
  deleteProcessRequest,
  updateProcessRequest,
  getProcessDetailRequest
} from "@/api/orderlines/orderlinesManager/process/index";
import { getProcessVersionOptionRequest } from "@/api/option/index";

let { process_id, process_instance_id, process_name, process_version, isSave, isRunning, isRedirect } = storeToRefs(
  useFlowStore()
);

let activeName = "create";

let options = ref<ProcessVersionOptionType[]>([]);
let versionVisible = ref<boolean>(false);
let versionForm = ref<ProcessVersionType>({
  process_id: process_id.value as string,
  version: "",
  version_desc: ""
});
let versionData = ref<ProcessVersionType[]>([]);
let debugMode = ref(false);
let processInfo = reactive<Process.ProcessItem>({ process_id: process_id.value, process_name: process_name.value });

onMounted(async () => {
  await getProcessVersionOption();
  await getProcessVersionByName();
  await getProcessInfo();
});

const getProcessInfo = async () => {
  const response: any = await getProcessDetailRequest(process_id.value);
  processInfo = response.data;
  debugMode.value = response.data.mode == "debug";
};

const getProcessVersionOption = async () => {
  const res: any = await getProcessVersionOptionRequest(process_name.value);
  if (res.code == 200) {
    options.value = res.data;
  } else {
    ElMessage.error("获取流程流程版本失败");
  }
};
// 删除版本
const deleteProcessVersion = async (id: number) => {
  let data: any = { id: id };
  let res: any = await deleteProcessRequest(data);
  if (res.code === 200) {
    ElMessage.success("版本删除成功");
    await getProcessVersionByName();
  }
};
//获取版本描述
const getProcessVersion = async () => {
  versionVisible.value = true;
  let res: any = await getProcessVersionRequest(process_id.value);
  versionForm.value = res.data;
};
// 根据流程名称获取流程
const getProcessVersionByName = async () => {
  let res: any = await getProcessVersionByNameRequest(process_name.value);
  if (res.code == 200) {
    versionData.value = res.data;
  } else {
    ElMessage.error("获取流程流程版本失败");
  }
};
// 修改流程运行模式
const changeProcessMode = async () => {
  processInfo["mode"] = debugMode.value ? "debug" : "run";
  const response: any = await updateProcessRequest(processInfo);
  if (response.code == 200) {
    ElMessage.success(response.message);
    console.log("修改后", debugMode.value);
  } else {
    ElMessage.error("修改失败");
  }
};

//创建流程版本
const createProcessVersion = async () => {
  versionVisible.value = false;
  let response: any = await createProcessVersionRequest(versionForm.value);
  if (response.code == 200) {
    process_id.value = process_version.value;
    process_version.value = process_version.value;
    setStorage(response.data.process_id, "PROCESS_ID");
    setStorage(response.data.process_id, "PROCESS_VERSION");
    await getProcessVersionOption();
    window.location.reload();
  }
};

//修改流程版本
const changeProcessVersion = async () => {
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
// 启动流程
const startProcess = async () => {
  const response: any = await startProcessRequest(process_id.value);
  process_instance_id.value = response.data.process_instance_id;
  if (response.code == 200) {
    ElMessage.success(response.message);
    isRunning.value = true;
    setStorage(true, "IS_RUNNING");
    // await getRunningTask();
  } else {
    ElMessage.error("流程启动失败" + response.message);
  }
};

// 停止流程
const stopProcess = async () => {
  let response: any = await stopProcessRequest(process_id.value);
  if (response.code == 200) {
    ElMessage.success(response.message);
  } else {
    ElMessage.error("流程停止失败" + response.message);
  }
};

const pausedProcess = async () => {
  let response: any = await pausedProcessRequest(process_id.value);
  if (response.code === 200) {
    ElMessage.success(response.message);
  } else {
    ElMessage.error("流程暂停失败" + response.message);
  }
};

const recoverProcess = async () => {
  let response: any = await recoverProcessRequest(process_id.value);
  if (response.code == 200) {
    ElMessage.success("流程恢复成功");
  } else {
    ElMessage.error("流程恢复失败" + response.message);
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
      ElMessage.success(response.message);
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
.el-switch__core {
  --el-switch-on-color: #ff4949;
  --el-switch-off-color: #13ce66;
}
</style>
