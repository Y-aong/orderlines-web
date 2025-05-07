<template>
  <el-menu class="el-menu" mode="vertical" :unique-opened="true">
    <template v-for="node in nodeMenu" :key="node.title">
      <el-sub-menu v-if="node.title" :index="node.title">
        <template #title>
          <el-icon> <component :is="node.icon"></component> </el-icon>
          <span>{{ node.title }}</span>
        </template>
        <!-- common -->
        <template v-if="!node.nodes[0].nodes">
          <VueDraggable
            v-model="node.nodes"
            :animation="150"
            ghost-class="ghost"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="clone"
            :sort="false"
            :scroll="true"
            :disabled="!isEdit"
          >
            <div v-for="(item, index) in node.nodes" :key="index">
              <el-menu-item :index="item.text" v-if="!node.nodes[0].nodes">
                <el-button class="title" plain>{{ item.text }}</el-button>
              </el-menu-item>
            </div>
          </VueDraggable>
        </template>
        <!-- category -->
        <template v-if="node.nodes[0].nodes">
          <template v-for="item in node.nodes" :key="item.title">
            <el-sub-menu :index="item.title">
              <template #title>{{ item.title }}</template>
              <VueDraggable
                v-model="item.nodes"
                :animation="150"
                ghost-class="ghost"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :clone="clone"
                :sort="false"
                :scroll="true"
                :disabled="!isEdit"
              >
                <div v-for="temp in item.nodes" :key="temp.text">
                  <el-menu-item :index="temp.text">
                    <el-button class="title" plain>{{ temp.text }}</el-button>
                  </el-menu-item>
                </div>
              </VueDraggable>
            </el-sub-menu>
          </template>
        </template>
      </el-sub-menu>
    </template>
  </el-menu>

  <VueDraggable
    v-model="taskNodes"
    :animation="150"
    group="people"
    ghost-class="ghost"
    class="test_edit"
    @add="add_task"
    @update="refresh"
    :disabled="!isEdit"
    :scroll="true"
    :class="{ edit_height_debug: isDebug, edit_height: !isDebug }"
  >
    <div v-for="item in taskNodes" :key="item.id" class="test_edit_item" @click="checkSelectedTask(item)">
      <!-- 左侧内容区域（名称 + 描述） -->
      <div class="left-content">
        <span class="task_name">
          <el-tag :type="item.breakpoint ? 'warning' : 'primary'">
            {{ item.task_index_id }}、{{ item.task_name }}-节点
          </el-tag>
        </span>
        <span class="task_description"> 功能描述：{{ item.desc }}; 函数参数：{{ item.method_kwargs }} </span>
      </div>

      <!-- 操作列 -->
      <div class="actions">
        <el-switch
          v-model="item.breakpoint"
          size="small"
          active-text="设置断点"
          inactive-text="取消断点"
          style="margin: 5px"
          @click="updateTaskBreakpoint(item.task_id, item.breakpoint ? 1 : 0)"
        />
        <el-button circle size="small" :icon="Upload" @click="upload(item)" />
        <el-button circle size="small" :icon="Download" @click="download(item)" />
        <el-button circle size="small" :icon="Delete" @click="remove(item)" />
      </div>
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { DraggableEvent } from "vue-draggable-plus";
import { VueDraggable } from "vue-draggable-plus";
import { storeToRefs } from "pinia";
import useGraphStore from "@/stores/modules/graph";
import { useUserStore } from "@/stores/modules/user";
import { BaseResponse, BaseData } from "@/api/interface";
import { v4 as uuid } from "uuid";
import { Delete, Upload, Download } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  updateTasksRequest
} from "@/api/orderlines/orderlinesManager/task/index";
import { createGraphNodeRequest } from "@/api/graph/graphData/index";
import { GraphNode, TaskTable } from "@/api/graph/graphData/type";
import { taskNodeType } from "@/stores/modules/graph";
import { taskBreakpointRequest } from "@/api/orderlines/orderlinesManager/task/index";
import useGraphStatueStore from "@/stores/modules/graphStatue";

let { isEdit, isUpdateParam, isDebug } = storeToRefs(useGraphStatueStore());
let { nodeConfig, nodeParam, nodeResult, process_id, defaultTaskConfig, nodeMenu } = storeToRefs(useGraphStore());
let { getNodeMenu, getTaskNode } = useGraphStore();
let { userInfo } = storeToRefs(useUserStore());

const { getGraphNodeData } = useGraphStore();
const taskNodes = ref<TaskTable.TaskType[]>([]);
const taskTypes = {
  "function-node": "common",
  "start-node": "start",
  "end-node": "end",
  "process-control-node": "process_control",
  "parallel-node": "parallel",
  "group-node": "group",
  "sub-process-node": "sub_process"
};

onMounted(async () => {
  let nodeMenuData = await getNodeMenu();
  nodeMenu.value = nodeMenuData;
  const response: BaseResponse<TaskTable.TaskType[]> = await getTasksRequest(process_id.value);
  taskNodes.value = response.data;
});
watch(
  () => isUpdateParam.value,
  async newVal => {
    if (newVal) {
      const response: BaseResponse<TaskTable.TaskType[]> = await getTasksRequest(process_id.value);
      taskNodes.value = response.data;
      isUpdateParam.value = !isUpdateParam.value;
    }
  }
);

const checkSelectedTask = async (taskNode: TaskTable.TaskType) => {
  // 开始获取节点的参数和返回值
  console.log(taskNode);

  nodeConfig.value.task_id = taskNode.task_id;
  nodeConfig.value.task_name = taskNode.task_name;
  nodeConfig.value.version = taskNode.module_version;
  nodeConfig.value.desc = taskNode.desc;
  nodeConfig.value.task_type = taskNode.task_type;
  nodeConfig.value.id = taskNode.id;
  await getGraphNodeData(process_id.value, taskNode.task_id);
};
// 创建任务节点
const createTaskNode = async (item: TaskTable.MenuTaskType, taskId: string, taskType: string) => {
  let node_config = {
    task_id: taskId,
    task_name: item.text,
    desc: item.desc,
    task_module: item.class_name,
    method_name: item.method_name,
    task_type: taskType,
    version: item.version,
    options: item.options
  };

  let task: Task.TaskItem = {
    task_id: taskId,
    task_name: item.text,
    desc: item.desc,
    task_module: item.class_name,
    method_name: item.method_name,
    task_type: taskType,
    process_id: process_id.value,
    task_config: defaultTaskConfig.value,
    creator_name: userInfo.value.login_value
  };

  if (item.type === "function-node") {
    const method_kwargs = nodeParam.value.reduce((acc, item) => {
      acc[item.name] = item.default;
      return acc;
    }, {});
    task.method_kwargs = method_kwargs;
  }

  if (item.type !== "select-node") {
    // 创建任务节点
    const result: BaseResponse<BaseData> = await createTaskRequest(task);
    if (result.code == 200) {
      node_config["id"] = result.data.table_id;
    }
    // 设置node config
    nodeConfig.value = node_config;
  }
};
const updateTaskBreakpoint = async (taskId: string, breakpoint: number) => {
  const result = await taskBreakpointRequest(taskId, breakpoint);
  if (result.code == 200) {
    ElMessage.success(breakpoint == 1 ? "设置断点成功！" : "取消断点成功！");
  } else {
    ElMessage.error(breakpoint == 1 ? "设置断点失败！" : "取消断点失败！");
  }
};

// 创建任务的参数和返回值
const setNodeParamResult = async (taskId: string) => {
  let graphNode: GraphNode.GraphNode = {
    process_id: process_id.value,
    task_id: taskId,
    nodeResult: nodeResult.value,
    defaultTaskConfig: defaultTaskConfig.value,
    nodeParam: nodeParam.value
  };
  const res: BaseResponse<string> = await createGraphNodeRequest(graphNode);
  if (res.code !== 200) ElMessage.error("存放流程数据失败");
};

// 克隆节点
const clone = (element: TaskTable.MenuTaskType) => {
  return {
    task_name: `${element.text}`,
    desc: `${element.desc}`,
    module_version: element.version,
    method_name: element.method_name,
    task_type: taskTypes[element.type],
    process_id: process_id.value,
    task_id: uuid()
  };
};

// 刷新table数据
const refresh = async () => {
  for (let i = 0; i < taskNodes.value.length; i++) {
    taskNodes.value[i].task_index_id = i + 1;
  }
  await updateTasksRequest(taskNodes.value);
  const response: BaseResponse<TaskTable.TaskType[]> = await getTasksRequest(process_id.value);
  taskNodes.value = response.data;
};

// 删除节点
const remove = async (item: TaskTable.TaskType) => {
  const task_id = item.task_id;
  taskNodes.value.splice(
    taskNodes.value.findIndex((item: TaskTable.TaskType) => item.task_id === task_id),
    1
  );
  await deleteTaskRequest(task_id);
  ElMessage.success("删除节点成功");
  await refresh();
};

// 添加节点
const add_task = async (event: DraggableEvent) => {
  const element = event.data as TaskTable.MenuTaskType;
  const taskId = event.clonedData.task_id;

  const taskNode: taskNodeType = {
    method_name: element.method_name,
    class_name: element.class_name,
    version: element.version
  };
  // 获取节点的参数和返回值
  await getTaskNode(taskNode);
  // 创建任务节点
  await createTaskNode(element, taskId, taskTypes[element.type]);
  // 创建任务的参数和返回值
  await setNodeParamResult(taskId);
  for (let i = 0; i < taskNodes.value.length; i++) {
    taskNodes.value[i].task_index_id = i + 1;
    if (taskNodes.value[i].task_id === taskId) {
      taskNodes.value[i].id = nodeConfig.value.id;
    }
  }
  await updateTasksRequest(taskNodes.value);
};

// 上移节点
const upload = async (item: TaskTable.TaskType) => {
  const task_id = item.task_id;

  for (let i = 0; i < taskNodes.value.length; i++) {
    if (taskNodes.value[i].task_id === task_id) {
      if (i > 0) {
        const temp = taskNodes.value[i];
        taskNodes.value[i] = taskNodes.value[i - 1];
        taskNodes.value[i - 1] = temp;
      }
      break;
    }
  }
  await refresh();
};
// 下移节点
const download = async (item: TaskTable.TaskType) => {
  const task_id = item.task_id;

  if (item.method_name === "start") {
    ElMessage.error("开始节点不可以向下移动");
    return;
  }

  for (let i = 0; i < taskNodes.value.length; i++) {
    if (taskNodes.value[i].task_id === task_id) {
      if (i < taskNodes.value.length - 1) {
        const temp = taskNodes.value[i];
        taskNodes.value[i] = taskNodes.value[i + 1];
        taskNodes.value[i + 1] = temp;
      }
      break;
    }
  }
  await refresh();
};
</script>

<style scoped lang="scss">
:deep(.el-sub-menu__title) {
  height: 48px !important;
}
.edit_height {
  height: calc(100% - 65px);
}
.edit_height_debug {
  height: 75%;
}
.el-menu {
  position: fixed;
  width: 210px;
  height: 100vh !important;
  font-size: 12;
  border: 1px solid #ebe6e6;
  border-right: none;
  .el-menu-item {
    width: 100%;
    height: 60%;
    margin: 8px auto;
    .title {
      width: 100px;
      height: 24px;
      font-size: 12px;
      border-radius: 5px;
    }
  }
}
.test_edit {
  position: fixed;
  top: 60px;
  left: 210px;
  width: calc(100% - 210px - 25%);
  overflow-y: auto;
  border: 1px solid #ebe6e6;
  .test_edit_item {
    display: flex;
    align-items: center; /* 垂直居中 */
    padding: 10px 15px;
    border-bottom: 1px solid #eeeeee;
    .left-content {
      display: flex;
      flex: 1; /* 占据剩余空间 */
      flex-direction: column; /* 名称和描述垂直排列 */
      margin-right: 20px; /* 与操作列间距 */
      .task_name {
        font-size: 13px;
        font-weight: bold;
      }
      .task_description {
        max-width: 900px; /* 限制描述长度 */
        overflow: hidden;
        font-size: 12px;
        color: #666666;
        text-indent: 2em;
        text-overflow: ellipsis;
        white-space: nowrap; /* 防止换行（可选） */
      }
    }
    .actions {
      display: flex;
      align-items: center;
    }
  }
}
</style>
