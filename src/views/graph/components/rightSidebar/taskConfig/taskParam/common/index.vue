<template>
  <el-table :data="nodeParam" max-height="65vh" stripe show-header style="width: 100%">
    <el-table-column fixed prop="desc" label="参数名" min-width="72">
      <template #default="scope">
        <p>{{ scope.row.required ? "*" : "" }}{{ scope.row.desc }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="参数值" min-width="240" required>
      <template #default="scope">
        <!-- 参数类型为input的 -->
        <el-input
          v-if="scope.row.param_type === 'input' || !scope.row.param_type"
          v-model="scope.row.value"
          :placeholder="`类型${scope.row.type}`"
          :disabled="isRunning"
          @blur="updateTask(scope.row)"
        >
          <template #prepend v-if="!showVariable">
            <el-button :icon="Search" @click="useVariable" size="small" circle v-if="!showVariable" />
          </template>
          <template #append v-if="showVariable">
            <el-select
              v-model="scope.row.value"
              placeholder="使用变量"
              style="width: 100px"
              @click="getVariableOption"
              @change="updateTask(scope.row)"
            >
              <el-option v-for="(item, index) in variableOption" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-input>
        <!--参数类型为code的 -->
        <el-button
          v-if="scope.row.param_type === 'code'"
          type="primary"
          plain
          size="small"
          :disabled="isRunning"
          @click="showPythonEdit"
        >
          点击输入代码
        </el-button>
        <!-- 参数类型为upload -->
        <el-input
          v-if="scope.row.param_type === 'upload'"
          v-model="scope.row.value"
          :placeholder="`类型${scope.row.type}`"
          :disabled="true"
          @change="updateTask(scope.row)"
        >
          <template #prepend>
            <el-upload
              v-model="scope.row.value"
              action=""
              :limit="1"
              :on-change="handleChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <template #trigger>
                <el-tooltip class="box-item" effect="dark" content="点击上传文件" placement="top-start">
                  <el-button :icon="UploadFilled" />
                </el-tooltip>
              </template>
            </el-upload>
          </template>
        </el-input>
        <!-- 参数类型为select -->
        <el-select
          v-model="scope.row.value"
          placeholder="Select"
          style="width: 240px"
          @change="updateTask(scope.row)"
          v-if="scope.row.param_type === 'select'"
        >
          <el-option v-for="item in scope.row.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- 参数为时间 -->
        <el-date-picker
          v-if="scope.row.param_type === 'datetime'"
          v-model="scope.row.value"
          type="datetime"
          placeholder="请选择时间"
          @change="updateTask(scope.row)"
        />
        <!-- 参数为uia -->
        <el-button v-if="scope.row.param_type === 'uia'" @click="getUia">获取uia</el-button>
        <!-- 参数为列表 -->
        <el-table
          v-if="scope.row.param_type === 'value_list'"
          :data="scope.row.value"
          style="width: 100%"
          border
          stripe
          show-header
          size="small"
          max-height="200"
        >
          <el-table-column fixed prop="values" label="元素" align="center">
            <template #default="temp">
              <el-input v-model="temp.row.item" placeholder="请输入值" :disabled="isRunning">
                <template #prepend v-if="!showVariable">
                  <el-button :icon="Search" @click="useVariable" size="small" circle v-if="!showVariable" />
                </template>
                <template #append v-if="showVariable">
                  <el-select
                    v-model="temp.row.item"
                    placeholder="变量"
                    style="width: 80px"
                    @change="showVariable = false"
                    @click="getVariableOption"
                  >
                    <el-option
                      v-for="(item, index) in variableOption"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column width="70" align="center" fixed>
            <template #default="data">
              <el-button link type="primary" size="small" @click="addSelector(data.$index)" :icon="Plus" />
              <el-button link type="primary" size="small" @click="deleteRow(data.$index)" :icon="Delete" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 参数为两个元素 -->
        <el-table
          v-if="scope.row.param_type === 'double_value'"
          :data="scope.row.value"
          style="width: 100%"
          border
          stripe
          show-header
          size="small"
          max-height="200"
        >
          <el-table-column fixed prop="selector" label="xpath" align="center">
            <template #default="xpath">
              <el-input v-model="xpath.row.selector" placeholder="请输入xpath" :disabled="isRunning" />
            </template>
          </el-table-column>
          <el-table-column fixed prop="text" label="text" align="center" width="100">
            <template #default="text">
              <el-input v-model="text.row.text" placeholder="请输入文字" :disabled="isRunning" />
            </template>
          </el-table-column>

          <el-table-column width="70" align="center" fixed>
            <template #default="item">
              <el-button link type="primary" size="small" @click="addSelector(item.$index)" :icon="Plus" />
              <el-button link type="primary" size="small" @click="deleteRow(item.$index)" :icon="Delete" />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          v-if="scope.row.param_type === 'value_list' || scope.row.param_type === 'double_value'"
          style="width: 100%"
          type="success"
          @click="updateTask(scope.row)"
        >
          保存xpath
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button style="width: 100%" type="primary" @click="cancel"> 查看变量 </el-button>

  <!-- 显示任务参数 -->
  <el-dialog v-model="dialogTableVisible" :title="`${nodeConfig.task_name}——参数说明`" style="width: 80%">
    <el-table :data="nodeParam" style="width: 100%" border>
      <el-table-column prop="name" label="参数名称" min-width="60" align="center" />
      <el-table-column prop="value" label="参数值" min-width="180">
        <template #default="scope">
          <json-viewer
            v-if="typeof scope.row.value === 'object'"
            :value="scope.row.value"
            copyable
            boxed
            sort
            expanded
          />
          <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="default" label="默认值" min-width="150">
        <template #default="scope">
          <json-viewer
            v-if="typeof scope.row.default === 'object' && scope.row.default !== null"
            :value="scope.row.default"
            copyable
            boxed
            sort
            expanded
          />
          <span v-else>{{ scope.row.default }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述信息" min-width="80" />
      <el-table-column prop="required" label="是否必填" min-width="50" />
      <el-table-column prop="type" label="参数类型" min-width="60" />
    </el-table>
  </el-dialog>

  <el-dialog v-model="pythonCodeVisible" title="输入python代码" style="height: 60vh" @close="updatePythonCodeParam">
    <EDA :get-code="getCode" />
  </el-dialog>
</template>
<script setup lang="ts" name="Common">
import { ref, onMounted, onUnmounted } from "vue";
import { UploadProps } from "element-plus";
import { storeToRefs } from "pinia";
import useGraphStore from "@/stores/modules/graph";
import { Search, UploadFilled } from "@element-plus/icons-vue";
import { updateTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { ElNotification, ElMessage } from "element-plus";
import { createGraphNodeRequest } from "@/api/graph/graphData/index";
import { GraphNode } from "@/api/graph/graphData/type";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";
import { getProcessVariableOptionRequest } from "@/api/option/index";
import { GraphVariable } from "@/api/graph/variable/type";
import EDA from "@/components/EDA/index.vue";
import { BaseData, BaseResponse } from "@/api/interface/index";
import useGraphStatueStore from "@/stores/modules/graphStatue";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "@/stores/modules/user";
import { Delete, Plus } from "@element-plus/icons-vue";

let { userInfo } = storeToRefs(useUserStore());
let socketIo: Socket;
let dialogTableVisible = ref<boolean>(false);
let clearFlag = ref<boolean>(false);
let pythonCodeVisible = ref<boolean>(false);
let showVariable = ref<boolean>(false);
let variableOption = ref<GraphVariable.VariableOption[]>([{ label: "", value: "" }]);
let { isRunning, isUpdateParam } = storeToRefs(useGraphStatueStore());

const apiUrl = import.meta.env.VITE_API_URL;
const { nodeParam, nodeConfig, process_id } = storeToRefs(useGraphStore());

interface ParamItem {
  default: undefined | string;
  desc: string;
  name: string;
  required: boolean;
  title: string;
  type: string;
  value?: string;
  param_type?: string;
}

onMounted(() => {
  init("uia");
});

onUnmounted(() => {
  closeSocket("uia");
});

// socket io连接
const init = (namespace: string) => {
  socketIo = io(`${apiUrl}/${namespace}`, { path: "/socket.io" });

  // 监听连接事件
  socketIo.on("connect", () => {
    console.log(`websocket:: connected to ${namespace} namespace`);
  });

  // 监听关闭事件
  socketIo.on("disconnect", () => {
    console.log(`websocket:: disconnected to namespace ${namespace} `);
  });

  // 监听接受信息
  socketIo.on(namespace, async data => {
    const topic = data.topic;
    const message = data.message;
    console.log("uia数据已经更新", message);

    const receive_process_id = data.process_id;
    if (topic === "uia" && message && receive_process_id === process_id.value) {
      let methodKwargs: { [key: string]: any } = {};
      for (const item of nodeParam.value) {
        if (item.name === "uia_info") {
          item.value = message;
          methodKwargs[item.name] = message;
        } else {
          const result = await preUpdateTask(item);
          if (!result) return;
          const { param_name, param_value } = result;
          methodKwargs[param_name] = param_value;
        }
      }
      await updateTaskBack(methodKwargs);
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
const addSelector = (index: number) => {
  nodeParam.value.forEach((item: any) => {
    if (item.param_type === "value_list") {
      item.value.splice(index + 1, 0, { item: "", param_type: "input" });
    } else if (item.param_type === "double_value") {
      item.value.splice(index + 1, 0, { item: "", text: "", param_type: "input" });
    }
  });
};
const deleteRow = (index: number) => {
  nodeParam.value.forEach((item: any) => {
    console.log(item);

    if (item.param_type === "value_list" || item.param_type === "double_value") {
      item.value.splice(index, 1);
    }
  });
};

// 获取uia信息
const getUia = () => {
  const message = {
    topic: "uia",
    msg: "get_uia",
    process_id: process_id.value
  };
  send("uia", message);
};

const cancel = () => {
  dialogTableVisible.value = true;
};

// 运行python代码修改参数
const updatePythonCodeParam = () => {
  if (nodeParam.value) {
    nodeParam.value.forEach((item: any) => {
      if (item.param_type === "code") updateTask(item);
    });
  }
};

// 显示python代码编辑器
const showPythonEdit = () => {
  pythonCodeVisible.value = !pythonCodeVisible.value;
};

// 获取子组件中的代码
const getCode = (code: string) => {
  nodeParam.value.forEach((item: any) => {
    if (item.param_type === "code") item.value = code;
  });
};

// 变量选择器
const useVariable = () => {
  showVariable.value = !showVariable.value;
};
const getVariableOption = async () => {
  const result: any = await getProcessVariableOptionRequest(process_id.value);
  variableOption.value = result.data;
};

// 上传文件
const handleChange: UploadProps["onChange"] = uploadFile => {
  nodeParam.value.forEach((item: any) => {
    if (item.param_type === "upload") item.value = uploadFile.name;
  });
};

// 修改任务参数
const updateTask = async (row: ParamItem) => {
  let method_kwargs: any = {};
  if (clearFlag.value) return;
  let result = await preUpdateTask(row);
  if (!result) return;
  let { param_name, param_value } = result;
  for (const item of nodeParam.value) {
    if (item.name === param_name) {
      item.value = param_value; // 修复赋值问题
      method_kwargs[item.name] = param_value;
    } else {
      result = await preUpdateTask(item);
      if (!result) return;
      let { param_name: newName, param_value: newValue } = result;
      method_kwargs[newName] = newValue;
    }
  }
  console.log("修改参数", method_kwargs);

  await updateTaskBack(method_kwargs);
  ElMessage.success("任务参数修改成功");
  isUpdateParam.value = true;
};

const preUpdateTask = async (row: ParamItem) => {
  const checkParamValue: any = row.value ? row.value : row.default;
  let param_name = row.name;
  let param_value: any;
  if (row.param_type === "input") {
    param_value = await checkParam(row);
  } else if (row.param_type === "datetime") {
    param_value = checkParamValue;
  } else if (row.param_type === "code") {
    param_value = checkParamValue;
  } else if (row.param_type === "upload") {
    param_value = checkParamValue;
  } else if (row.param_type === "select") {
    param_value = checkParamValue;
  } else if (row.param_type === "uia") {
    param_value = checkParamValue;
  } else if (row.param_type === "value_list") {
    param_value = checkParamValue;
  } else if (row.param_type === "double_value") {
    param_value = checkParamValue;
  } else {
    ElMessage.error(`不支持的参数类型${row.param_type}`);
    return undefined;
  }
  return param_value === undefined ? undefined : { param_name, param_value };
};

const updateTaskBack = async (method_kwargs: any) => {
  let taskNode: Task.TaskItem = {
    id: nodeConfig.value.id,
    process_id: process_id.value,
    method_kwargs: method_kwargs,
    updater_name: userInfo.value.login_value
  };
  let result: BaseResponse<BaseData> = await updateTaskRequest(taskNode);
  if (result.code !== 200) ElMessage.error("任务配置修改失败");
  await updateGraphNodeData();
  showVariable.value = false;
};

// 修改流程图节点数据
const updateGraphNodeData = async () => {
  const graph_node_data: GraphNode.GraphNode = {
    process_id: process_id.value,
    task_id: nodeConfig.value.task_id,
    nodeParam: nodeParam.value
  };
  await createGraphNodeRequest(graph_node_data);
};

// 生成表单校验规则
const checkParam = (row: any) => {
  let param_type: string = row.type;
  let param_value: string = row.value;
  // 使用变量
  if (typeof param_value === "string" && param_value.startsWith("${")) return param_value;
  // 使用普通输入
  if (param_type.search("str") !== -1 && param_type.search("class") !== -1) {
    if (!param_value) {
      return "";
    } else {
      return param_value;
    }
  } else if (param_type.search("int") !== -1 && param_type.search("class") !== -1) {
    if (!param_value) {
      return 0;
    } else if (!isNaN(parseInt(param_value))) {
      return parseInt(param_value);
    } else {
      ElNotification.error({ title: "参数类型异常", message: `参数【${row.name}】类型规定为【${param_type}】` });
      return undefined;
    }
  } else if (param_type.search("dict") !== -1 && param_type.search("class") !== -1) {
    if (!param_value) return {};
    try {
      if (typeof param_value === "object") {
        return param_value;
      } else {
        return JSON.parse(param_value);
      }
    } catch (e) {
      console.log("检查dict参数异常", e);
      ElNotification.error({ title: "参数类型异常", message: `参数【${row.name}】类型规定为【${param_type}】` });
      return undefined;
    }
  } else if (param_type.search("list") !== -1 && param_type.search("class") !== -1) {
    if (!param_value) return [];
    try {
      if (typeof param_value === "object") {
        return param_value;
      } else {
        return JSON.parse(param_value);
      }
    } catch (e) {
      ElNotification.error({ title: "参数类型异常", message: `参数【${row.name}】类型规定为【${param_type}】` });
      return undefined;
    }
  } else if (param_type.search("float") !== -1 && param_type.search("class") !== -1) {
    if (!param_value) return 0;
    if (!isNaN(parseFloat(param_value))) {
      return parseFloat(param_value);
    } else {
      ElNotification.error({ title: "参数类型异常", message: `参数【${row.name}】类型规定为【${param_type}】` });
      return undefined;
    }
  } else {
    return param_value;
  }
};
</script>

<style scoped>
.required {
  margin-right: 4px;
  color: red;
}
.input-with-label {
  display: flex;
  align-items: center;
}
</style>
