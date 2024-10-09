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
          v-model="isDebug"
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
            :title="isDebug ? '是否确定Debug?' : '是否确定启动?'"
            @confirm="startProcess"
          >
            <template #reference>
              <el-button size="small" type="success" :disabled="!isSave">
                {{ isDebug ? "debug" : "启动" }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="isDebug && isRunning"
            :disabled="!isDebug"
            size="small"
            type="warning"
            @click="sendDebugSign('debug continue')"
          >
            继续debug
          </el-button>
          <el-button
            v-if="isDebug && isRunning"
            :disabled="!isDebug"
            size="small"
            type="danger"
            @click="sendDebugSign('debug stop')"
          >
            停止debug
          </el-button>
          <el-popconfirm
            v-if="isRunning"
            width="220"
            :confirm-button-text="isDebug ? '重新debug' : '重启'"
            :cancel-button-text="isDebug ? '不debug' : '不重启'"
            :icon="InfoFilled"
            icon-color="#626AEF"
            :title="isDebug ? '是否确定重新debug?' : '是否确定重启?'"
            @confirm="startProcess"
          >
            <template #reference>
              <el-button size="small" type="success" :disabled="!isSave">
                {{ isDebug ? "重新debug" : "重启" }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            size="small"
            type="danger"
            @click="stopProcess"
            v-if="isRunning && !isDebug"
            :disabled="!isRunning || isStop || isComplete"
          >
            停止
          </el-button>
          <el-button
            size="small"
            type="warning"
            @click="pausedProcess"
            v-if="isRunning && !isDebug"
            :disabled="!isRunning || isStop || isComplete"
          >
            暂停
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="recoverProcess"
            v-if="isRunning && !isDebug"
            :disabled="!isPause || isComplete"
          >
            继续
          </el-button>
        </template>
        <el-button size="small" type="primary" @click="saveProcess" v-if="isSave">编辑</el-button>
        <el-button size="small" type="primary" @click="saveProcess" v-if="isEdit"> 保存</el-button>
        <el-button v-if="isRedirect" size="small" type="success" @click="runningStatus"> 状态 </el-button>
        <el-select
          v-if="!isRunning && !isSave"
          v-model="process_version"
          placeholder="选择版本"
          style="width: 120px; margin-left: 15px"
          @change="gotoTargetProcess"
        >
          <el-option v-for="item in versionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select
          v-if="!isRunning && !isSave"
          v-model="namespace"
          placeholder="选择命名空间"
          style="width: 120px; margin-left: 15px"
          @change="gotoTargetProcess"
        >
          <el-option v-for="item in namespaceOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table :data="versionData" style="width: 100%; height: 400px">
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

<script setup lang="ts" name="FlowTabbar">
import LOGO from "./logo/index.vue";
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useFlowStore from "@/stores/modules/flow";
import useFlowStatueStore from "@/stores/modules/flowStatue";
import { InfoFilled } from "@element-plus/icons-vue";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import {
  pausedProcessRequest,
  recoverProcessRequest,
  startProcessRequest,
  stopProcessRequest
} from "@/api/orderlines/orderlinesOperate/index";
import { OrderlinesOperator } from "@/api/orderlines/orderlinesOperate/type";
import {
  createProcessVersionRequest,
  getProcessVersionByIDRequest,
  getProcessVersionByNameRequest
} from "@/api/flow/flowOperator/index";
import { saveFlowRequest } from "@/api/flow/flowData/index";
import { FlowOperator } from "@/api/flow/flowOperator/type";
import { ElMessage } from "element-plus";
import { setStorage } from "@/utils/storage";
import {
  deleteProcessRequest,
  updateProcessRequest,
  getProcessDetailRequest
} from "@/api/orderlines/orderlinesManager/process/index";
import { getProcessVersionOptionRequest, getProcessNameSpaceOptionRequest } from "@/api/option/index";
import { getCurrentDate } from "@/utils/currentDateTime";
import { Option } from "@/api/option/type";
import { BaseResponse } from "@/api/interface/index";
import { DeleteData, BaseData } from "@/api/interface";
import { io, Socket } from "socket.io-client";
import useRunningTaskStore from "@/stores/modules/runningTask";
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());
let { running_edge, taskProgress, graph_data } = storeToRefs(useRunningTaskStore());

let { process_id, process_instance_id, process_name, process_version, namespace } = storeToRefs(useFlowStore());
let { isDebug, isSave, isRunning, isEdit, isRedirect, isPause, isContinue, isStop, isComplete } = storeToRefs(
  useFlowStatueStore()
);
let activeName = "create";
let versionOptions = ref<Option.OptionItem[]>([]);
let namespaceOptions = ref<Option.OptionItem[]>([]);
let versionVisible = ref<boolean>(false);
let versionForm = ref<FlowOperator.ProcessVersionType>({
  process_id: process_id.value as string,
  version: "",
  namespace: "",
  version_desc: "",
  creator_name: userInfo.value.login_value
});
let versionData = ref<FlowOperator.ProcessVersionType[]>([]);
let processInfo = reactive<Process.ProcessItem>({
  process_id: process_id.value,
  process_name: process_name.value,
  namespace: "default",
  version: "default"
});
let socketIo: Socket;

onMounted(async () => {
  await getProcessVersionOption();
  await getProcessNamespaceOption();
  await getProcessVersionByName();
  await getProcessInfo();
  init("running_logger");
});

// socket io连接
const init = (namespace: string) => {
  socketIo = io(`http://127.0.0.1:15900/${namespace}`, { path: "/socket.io" });

  // 监听连接事件
  socketIo.on("connect", () => {
    console.log(`websocket:: connected to ${namespace} namespace`);
  });

  // 监听关闭事件
  socketIo.on("disconnect", () => {
    console.log(`websocket:: disconnected to namespace ${namespace} `);
  });

  // 监听接受信息
  socketIo.on(namespace, data => {
    try {
      const topic = data.topic;
      const message = data.message;
      const receive_process_instance_id = data.process_instance_id;

      if (topic === "running_logger" && receive_process_instance_id === process_instance_id.value) {
        running_edge.value = message.running_edge;
        taskProgress.value = message.task_progress;
        graph_data.value = message.graph_data.graphData;
      }
    } catch (error) {
      console.error("websocket:: 异常信息", data);
      console.error("websocket:: 处理消息时出错:", error);
    }
  });
};

// socket 发送消息
const send = (namespace: string, data: any) => {
  socketIo.emit(namespace, data);
  console.log(`websocket:: namespace ${namespace}发送消息:`, data);
};

// socket io关闭
const closeSocket = (namespace: string) => {
  if (socketIo) {
    socketIo.close();
    console.log(`websocket:: 关闭namespace ${namespace} `);
  }
};

// 获取流程命名空间选项
const getProcessNamespaceOption = async () => {
  const response: BaseResponse<Option.OptionResponse> = await getProcessNameSpaceOptionRequest(namespace.value);
  namespaceOptions.value = Array.isArray(response.data) ? response.data : [];
};

// 获取流程debug信息
const getProcessInfo = async () => {
  const response: BaseResponse<Process.ProcessItem> = await getProcessDetailRequest(process_id.value);
  processInfo = response.data;
  isDebug.value = response.data.mode == "debug";
};

// 发送debug信息
const sendDebugSign = async (msg: string) => {
  const message = {
    topic: "debug_sign",
    msg: msg,
    process_instance_id: process_instance_id.value
  };
  send("running_logger", message);
};

// 获取流程版本
const getProcessVersionOption = async () => {
  const response: BaseResponse<Option.OptionResponse> = await getProcessVersionOptionRequest(process_name.value);
  if (response.code == 200) {
    versionOptions.value = Array.isArray(response.data) ? response.data : [];
  } else {
    ElMessage.error("获取流程流程版本失败");
  }
};

// 删除版本
const deleteProcessVersion = async (id: number) => {
  let response: BaseResponse<DeleteData> = await deleteProcessRequest(id);
  if (response.code === 200) {
    ElMessage.success("版本删除成功");
    await getProcessVersionByName();
  }
};

//获取版本描述
const getProcessVersion = async () => {
  versionVisible.value = true;
  let response: BaseResponse<FlowOperator.ProcessVersionType[]> = await getProcessVersionByIDRequest(process_id.value);
  if (response.code == 200 && response.data.length === 1) {
    versionForm.value = response.data[0];
  }
};

// 根据流程名称获取流程
const getProcessVersionByName = async () => {
  let response: BaseResponse<FlowOperator.ProcessVersionType[]> = await getProcessVersionByNameRequest(
    process_name.value
  );
  if (response.code == 200) {
    versionData.value = response.data;
  } else {
    ElMessage.error("获取流程流程版本失败");
  }
};

// 修改流程运行模式
const changeProcessMode = async () => {
  processInfo["mode"] = isDebug.value ? "debug" : "run";
  processInfo["update_time"] = getCurrentDate();
  processInfo["updater_name"] = userInfo.value.login_value;

  const response: BaseResponse<BaseData> = await updateProcessRequest(processInfo);
  if (response.code == 200) {
    ElMessage.success(response.message);
  } else {
    ElMessage.error("修改debug模式失败");
  }
};

//创建流程版本
const createProcessVersion = async () => {
  versionVisible.value = false;
  let response: BaseResponse<FlowOperator.CreateProcessVersion> = await createProcessVersionRequest(versionForm.value);
  if (response.code == 200) {
    process_id.value = process_version.value;
    process_version.value = process_version.value;
    setStorage(response.data.process_id, "PROCESS_ID");
    setStorage(response.data.process_id, "PROCESS_VERSION");
    await getProcessVersionOption();
    window.location.reload();
  }
};

//根据流程命名空间/版本获取流程
const gotoTargetProcess = async (value: string) => {
  const response: BaseResponse<Process.ProcessItem> = await getProcessDetailRequest(value);
  process_id.value = response.data.process_id;
  process_name.value = response.data.process_name;
  process_version.value = response.data.version;
  namespace.value = response.data.namespace;
  setStorage(response.data.process_id, "PROCESS_ID");
  setStorage(response.data.process_name, "PROCESS_NAME");
  setStorage(response.data.version, "PROCESS_VERSION");
  setStorage(response.data.namespace, "PROCESS_NAMESPACE");
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
  const response: BaseResponse<OrderlinesOperator.startResponse> = await startProcessRequest(process_id.value);
  process_instance_id.value = response.data.process_instance_id;
  if (response.code == 200) {
    ElMessage.success(response.message);
    isRunning.value = true;
    isStop.value = false;
    isPause.value = false;
    isContinue.value = false;
    isEdit.value = false;
    isSave.value = true;
    setStorage(true, "IS_RUNNING");
    const message = {
      topic: "running_logger",
      msg: "process start",
      process_instance_id: process_instance_id.value
    };
    send("running_logger", message);
  } else {
    ElMessage.error("流程启动失败" + response.message);
  }
};

// 停止流程
const stopProcess = async () => {
  let response: BaseResponse<OrderlinesOperator.StopResponse> = await stopProcessRequest(process_id.value);
  if (response.code == 200) {
    ElMessage.success(response.message);
    isStop.value = true;
  } else {
    ElMessage.error("流程停止失败" + response.message);
  }
};

// 暂停流程
const pausedProcess = async () => {
  let response: BaseResponse<null> = await pausedProcessRequest(process_id.value);
  if (response.code === 200) {
    ElMessage.success(response.message);
    isPause.value = true;
  } else {
    ElMessage.error("流程暂停失败" + response.message);
  }
};

// 恢复流程
const recoverProcess = async () => {
  let response: BaseResponse<null> = await recoverProcessRequest(process_id.value);
  if (response.code == 200) {
    ElMessage.success("流程恢复成功");
    isContinue.value = true;
    isPause.value = false;
  } else {
    ElMessage.error("流程恢复失败" + response.message);
  }
};

// 保存流程
const saveProcess = async () => {
  if (isSave.value) {
    ElMessage.success("流程开始编辑！");
    isSave.value = false;
    isRunning.value = false;
    isEdit.value = true;
    closeSocket("running_logger");
  } else {
    const response: BaseResponse<string> = await saveFlowRequest({ process_id: process_id.value });

    if (response.code === 200) {
      isSave.value = true;
      setStorage(true, "IS_SAVE");
      ElMessage.success(response.message);
      isRunning.value = false;
      isSave.value = true;
      isEdit.value = false;
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
