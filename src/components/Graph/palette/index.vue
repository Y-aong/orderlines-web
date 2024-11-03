<template>
  <div class="flow_menu">
    <div class="node-collapse">
      <el-menu class="el-menu" mode="vertical" unique-opened>
        <template v-for="node in nodeMenu" :key="node.title">
          <el-sub-menu v-if="node.title" :index="node.title">
            <template #title>
              <el-icon>
                <component :is="node.icon"></component>
              </el-icon>
              <span class="sle">{{ node.title }}</span>
            </template>
            <!-- common -->
            <template v-if="!node.nodes[0].nodes">
              <div class="node-form draggable draggable-handle" v-for="(item, index) in node.nodes" :key="index">
                <el-menu-item :index="item.text" @mousedown="startDrag(item)" v-if="!node.nodes[0].nodes">
                  <el-button class="title" plain>{{ item.text }}</el-button>
                </el-menu-item>
              </div>
            </template>
            <!-- category -->
            <template v-if="node.nodes[0].nodes">
              <template v-for="item in node.nodes" :key="item.title">
                <el-sub-menu :index="item.title">
                  <template #title>{{ item.title }}</template>
                  <div
                    class="node-form draggable draggable-handle"
                    v-for="temp in item.nodes"
                    :key="temp.text"
                    @mousedown="startDrag(temp)"
                  >
                    <el-menu-item :index="temp.text">
                      <el-button class="title" plain>{{ temp.text }}</el-button>
                    </el-menu-item>
                  </div>
                </el-sub-menu>
              </template>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" name="Palette" setup>
import LogicFlow from "@logicflow/core";
import { onMounted } from "vue";
import useGraphStore from "@/stores/modules/graph";
import { taskNodeType } from "@/stores/modules/graph";
import { storeToRefs } from "pinia";
import { createGraphNodeRequest } from "@/api/graph/graphData/index";
import { GraphData, GraphNode, FlowGraphData } from "@/api/graph/graphData/type";
import { createTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { Task } from "@/api/orderlines/orderlinesManager/task/type";
import { v4 as uuid } from "uuid";
import { processControlStatusItem } from "@/utils/variable";
import { ElMessage } from "element-plus";
import { BaseResponse, BaseData } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

let { userInfo } = storeToRefs(useUserStore());
let { getNodeMenu, getTaskNode } = useGraphStore();
let { nodeConfig, nodeResult, nodeParam, process_id, defaultTaskConfig, nodeMenu } = storeToRefs(useGraphStore());

interface TaskType {
  "function-node": string;
  "start-node": string;
  "end-node": string;
  "process-control-node": string;
  "parallel-node": string;
  "group-node": string;
  "sub-process-node": string;
}
interface MenuItem {
  text: string;
  type: string;
  background: string;
  method_name: string;
  version: string;
  class_name: string;
  task_type: string;
  options: string[];
}

const taskTypes: TaskType = {
  "function-node": "common",
  "start-node": "start",
  "end-node": "end",
  "process-control-node": "process_control",
  "parallel-node": "parallel",
  "group-node": "group",
  "sub-process-node": "sub_process"
};

const props = defineProps({
  lf: {
    type: LogicFlow,
    required: true
  }
});

onMounted(async () => {
  let nodeMenuData = await getNodeMenu();
  nodeMenu.value = nodeMenuData;
});

// 按下鼠标时拖拽节点
const startDrag = async (item: MenuItem) => {
  const { lf } = props;
  // 检查开始节点不可以存在多个
  const graphData = lf.getGraphData();
  const flag = await checkStartNode(item.type, graphData);
  if (!flag) return;
  const task_id = uuid();
  lf.dnd.startDrag({
    id: task_id,
    type: item.type,
    text: item.text,
    properties: {
      method_name: item.method_name,
      class_name: item.class_name,
      version: item.version
    }
  });
  // 获取节点信息
  const taskNode: taskNodeType = {
    method_name: item.method_name,
    class_name: item.class_name,
    version: item.version
  };
  await getTaskNode(taskNode);
  const taskType = taskTypes[item.type as keyof TaskType];

  // 创建流程图节点信息
  await createFlowNode(item, task_id);

  // 创建任务节点
  await createTaskNode(item, task_id, taskType);
};

// 创建流程图信息
const createFlowNode = async (item: MenuItem, task_id: string) => {
  let graphNode: GraphNode.GraphNode = {
    process_id: process_id.value,
    task_id: task_id,
    nodeResult: nodeResult.value,
    defaultTaskConfig: defaultTaskConfig.value
  };
  if (item.type !== "process-control-node") {
    graphNode["nodeParam"] = nodeParam.value;
  } else {
    graphNode["nodeParam"] = processControlStatusItem;
    nodeParam.value = JSON.parse(JSON.stringify(processControlStatusItem));
  }
  const res: BaseResponse<string> = await createGraphNodeRequest(graphNode);
  if (res.code !== 200) ElMessage.error("存放流程数据失败");
};

// 创建任务节点
const createTaskNode = async (item: MenuItem, taskId: string, taskType: string) => {
  const node_config: GraphData.NodeConfig = {
    task_name: item.text,
    desc: item.text,
    version: item.version,
    task_module: item.class_name,
    task_id: taskId,
    method_name: item.method_name,
    task_type: taskType,
    options: item.options
  };

  let task: Task.TaskItem = {
    task_id: taskId,
    task_name: item.text,
    desc: item.text,
    process_id: process_id.value,
    task_type: taskType,
    method_name: item.method_name,
    task_module: item.class_name,
    task_config: defaultTaskConfig.value,
    creator_name: userInfo.value.login_value
  };

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

// 检查开始节点不可以存在多个
const checkStartNode = (nodeType: string, graphData: FlowGraphData.GraphData): boolean => {
  const nodes = graphData.nodes;
  nodes.forEach((val: FlowGraphData.Node) => {
    if (val.type === "start-node" && nodeType === "start-node") {
      ElMessage.error("一个流程中只可以存在一个开始节点");
      return false;
    }
  });
  return true;
};
</script>

<style scoped lang="scss">
// menu 高度设置
:deep(.el-sub-menu__title) {
  height: 46px !important;
}
.el-menu {
  max-height: 300px !important;
  font-size: 16;
  font-weight: bold;
  border-right: none;
}
.flow_menu {
  position: fixed;
  top: 60px;
  width: 210px;
  max-height: 100vh !important;
  background-color: #ffffff;
}
.node-collapse {
  width: 210px;
  height: 100vh;
}
.el-menu-item {
  width: 100%;
  height: 60%;
  margin: 8px auto;
}
.title {
  width: 120px;
  height: 24px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #999999;
  border-radius: 5px;
}
</style>
