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

<script lang="ts" setup>
import LogicFlow from "@logicflow/core";
import { onMounted } from "vue";
import useFlowStore from "@/stores/modules/flow";
import { storeToRefs } from "pinia";
import { createTaskFlowDataRequest } from "@/api/flow/taskNode/index";
import { createTaskRequest } from "@/api/orderlines/orderlinesManager/task/index";
import { v4 as uuid } from "uuid";

import { processControlStatusItem } from "@/utils/variable";
import { ElMessage } from "element-plus";

let { getNodeMenu, getTaskNode } = useFlowStore();
let { nodeConfig, nodeResult, nodeParam, process_id, defaultTaskConfig, nodeMenu } = storeToRefs(useFlowStore());

const taskTypes: any = {
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

const startDrag = async (item: any) => {
  const { lf } = props;
  // 检查开始节点不可以存在多个
  let graphData = lf.getGraphData();
  let flag = await checkStartNode(item.type, graphData);
  if (flag) {
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
    const taskNode: any = {
      method_name: item.method_name,
      class_name: item.class_name,
      version: item.version
    };
    await getTaskNode(taskNode);
    // 创建节点
    const taskType = taskTypes[item.type];
    //创建节点
    let task: any = {
      task_id: task_id,
      task_name: item.text,
      desc: item.text,
      process_id: process_id.value,
      task_type: taskType,
      method_name: item.method_name,
      task_module: item.class_name,
      task_config: defaultTaskConfig.value
    };
    let flow_data: any = {
      process_id: process_id.value,
      task_id: task_id,
      nodeResult: nodeResult.value,
      defaultTaskConfig: defaultTaskConfig.value
    };
    if (item.type !== "process-control-node") {
      flow_data["nodeParam"] = nodeParam.value;
    } else {
      flow_data["nodeParam"] = processControlStatusItem;
      nodeParam.value = JSON.parse(JSON.stringify(processControlStatusItem));
    }
    const res: any = await createTaskFlowDataRequest(flow_data);
    if (res.code !== 200) ElMessage.error("存放流程数据失败");
    const node_config: any = {
      task_name: item.text,
      desc: item.text,
      version: item.version,
      task_module: item.class_name,
      task_id: task_id,
      method_name: item.method_name,
      task_type: taskType
    };
    if (item.type !== "select-node") {
      // 创建任务节点
      const result: any = await createTaskRequest(task);
      if (result.code == 200) {
        node_config["id"] = result.data.table_id;
      }
      // 设置node config
      nodeConfig.value = node_config;
    }
  }
};

const checkStartNode = (nodeType: string, graphData: any): boolean => {
  const nodes = graphData.nodes;
  nodes.forEach((val: any) => {
    if (val.type === "start-node" && nodeType === "start-node") {
      ElMessage.error("一个流程中只可以存在一个开始节点");
      return false;
    }
  });
  return true;
};
</script>

<script lang="ts">
export default {
  name: "Palette"
};
</script>

<style scoped>
.el-menu {
  font-size: 16;
  font-weight: bold;
  border-right: none;
}
.flow_menu {
  position: fixed;
  top: 60px;
  width: 210px;
  height: 100vh;
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
  width: 100px;
  height: 24px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #999999;
  border-radius: 5px;
}
</style>
