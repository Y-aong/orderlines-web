<template>
  <div :class="{ debug_flow_chart: isDebug, edit_flow_chart: !isDebug }">
    <div ref="container" :class="{ debug_container: isDebug, edit_container: !isDebug }"></div>
  </div>
</template>

<script lang="js">
import { ref } from "vue";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import OrderlinesNodeExtension from "@/components/Flow/index.js";
import { Control, Group, MiniMap, SelectionSelect, InsertNodeInPolyline, Menu } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
import "@/components/Flow/style.css";
import useFlowStore from "@/stores/modules/flow";
import useFlowStatueStore from "@/stores/modules/flowStatue";
import useTaskGroupStore from "@/stores/modules/taskGroup";
import useProcessControlStore from "@/stores/modules/processControl";
import { storeToRefs } from "pinia";
import { getPCNextNodeRequest } from "@/api/flow/processControl/index";
import {
  getTaskDetailRequest,
  updateTaskRequest,
  deleteTaskRequest,
  updateGroupTaskRequest
} from "@/api/orderlines/orderlinesManager/task/index";
import { getGraphDataRequest, getGraphNodeDataRequest, createGraphDataRequest } from "@/api/flow/flowData/index";
import { taskBreakpointRequest } from "@/api/flow/flowOperator/index";
import { ElMessage } from "element-plus";
import { stepDebugRequest } from "@/api/orderlines/orderlinesOperate";
import { UseSocketIo } from "@/utils/webSocketio";
import { useUserStore } from "@/stores/modules/user";
import { setStorage } from "@/utils/storage";

let { userInfo } = storeToRefs(useUserStore());
let { process_id, process_instance_id, nodeConfig, nodeParam, nodeResult, defaultTaskConfig } = storeToRefs(
  useFlowStore()
);
let { isDebug } = storeToRefs(useFlowStatueStore());
let { taskGroup } = storeToRefs(useTaskGroupStore());
let { processControlOptions, processControlResult, processControlStatus } = storeToRefs(useProcessControlStore());

const { init, send } = UseSocketIo();
const { getGraphNodeData } = useFlowStore();
const editGrid = {
  visible: true,
  type: "mesh",
  size: 10,
  config: {
    color: "#eeeeee"
  }
};

export default {
  name: "FLOW",
  setup() {
    const currentNode = ref(null);
    const graphData = ref(null);
    return {
      currentNode,
      graphData,
      isDebug
    };
  },

  async mounted() {
    // 获取流程图数据
    init("running_logger");
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: editGrid,
      adjustEdge: true,
      hoverOutline: false,
      edgeSelectedOutline: false,
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: ["backspace", "Del"],
            callback: () => {
              const elements = this.lf.getSelectElements(true);
              let r = null;
              if (elements.edges.length !== 0 && elements.nodes.length == 0) {
                r = window.confirm("确定要删除连线吗？");
              } else if (elements.nodes !== 0 && elements.edges.length == 0) {
                let nodes = [];
                elements.nodes.forEach(node => {
                  nodes.push(node.text.value);
                });
                r = window.confirm(`确定要删除节点——${nodes.toString()}吗？`);
              } else {
                r = window.confirm("确定要删除所选元素吗？");
              }

              if (r) {
                this.lf.clearSelectElements();
                elements.edges.forEach(edge => this.lf.deleteEdge(edge.id));
                elements.nodes.forEach(async node => {
                  // 数据库删除节点
                  if (node.type !== "select-node") {
                    let result = await deleteTaskRequest(node.id);
                    if (result.code !== 200) {
                      ElMessage.error("删除节点失败！");
                    }
                  }
                  this.lf.deleteNode(node.id);
                });
              }
            }
          }
        ]
      },
      plugins: [OrderlinesNodeExtension, Control, Group, MiniMap, SelectionSelect, InsertNodeInPolyline, Menu]
    });
    // 增加菜单选项
    this.lf.setMenuConfig({
      nodeMenu: [
        {
          text: "删除节点",
          callback: node => {
            this.lf.deleteNode(node.id);
            ElMessage.success("删除节点成功！");
          }
        },
        {
          text: "添加断点",
          callback: async node => {
            const properties = this.lf.getProperties(node.id);
            if (properties.breakpoint) {
              ElMessage.warning("该节点已设置断点！");
              return;
            }
            const result = await taskBreakpointRequest(node.id, 1);
            if (result.code == 200) ElMessage.success("设置断点成功！");
            // 增加节点断点状态
            this.lf.setProperties(node.id, { breakpoint: true });
          }
        },
        {
          text: "删除断点",
          callback: async node => {
            const properties = this.lf.getProperties(node.id);
            if (!properties.breakpoint) {
              ElMessage.warning("该节点已取消断点！");
              return;
            }
            const result = await taskBreakpointRequest(node.id, 0);
            if (result.code == 200) ElMessage.success("取消断点成功！");
            // 删除断点
            this.lf.setProperties(node.id, { breakpoint: false });
          }
        },
        {
          text: "逐步运行",
          callback: async node => {
            if (!isDebug.value) {
              ElMessage.warning("请先开启调试模式！");
              return;
            }
            if (node.type !== "function-node") {
              ElMessage.warning("该节点不是任务节点，无法逐步运行！");
              return;
            }
            process_instance_id.value = `${process_id.value}-debug`;
            setStorage(`${process_id.value}-debug`, "PROCESS_INSTANCE_ID");
            const message = {
              topic: "running_logger",
              msg: "step_debug",
              process_instance_id: process_instance_id.value
            };
            send("running_logger", message);
            const response = await stepDebugRequest(process_id.value, node.id);
            if (response.code !== 200) {
              ElMessage.error("下一步运行失败！");
            } else {
              ElMessage.success("下一步运行成功！");
            }
          }
        }
      ]
    });
    // 开启框选
    this.lf.extension.selectionSelect.openSelectionSelect();
    // 增加导航
    this.lf.extension.control.addItem({
      iconClass: "custom-minimap",
      title: "",
      text: "导航",
      onMouseEnter: (lf, ev) => {
        const position = lf.getPointByClient(ev.x, ev.y);
        lf.extension.miniMap.show(position.domOverlayPosition.x - 120, position.domOverlayPosition.y + 35);
      },
      onClick: (lf, ev) => {
        const position = lf.getPointByClient(ev.x, ev.y);
        lf.extension.miniMap.show(position.domOverlayPosition.x - 120, position.domOverlayPosition.y + 35);
      }
    });
    await this.getGraphData();
    this.lf.render(this.graphData);
    // 文本更新监听
    this.lf.on("text:update", async data => {
      await this.updateTask(data);
    });
    // 自定义规则监听
    this.lf.on("connection:not-allowed", msg => {
      ElMessage.error(msg.msg);
    });
    // group节点提示信息
    this.lf.on("group:not-allowed", data => {
      ElMessage.error("任务组只允许加入普通任务节点,请手动删除新加入的" + data.node.text.value);
    });
    // 节点更新监听
    this.lf.on("node:click", async ({ data }) => {
      this.currentNode = data;
      // 将仓库中的数据值设置为空
      nodeConfig.value = [];
      nodeParam.value = [];
      nodeResult.value = [];
      defaultTaskConfig.value = [];
      // 获取接口中的数据
      await this.getTaskDetail(data);
      // 获取流程控制节点的后续节点
      if (data.type === "process-control-node") {
        await this.handleProcessControl(data);
      } else if (data.type === "group-node") {
        await this.handleTaskGroup(data);
      } else if (data.type === "parallel-node") {
        await this.handleParallel(data);
      } else {
        // 获取节点的展示数据
        await getGraphNodeData(process_id.value, data.id);
      }
    });
    // 画布上的元素发生变化
    this.lf.on("history:change", async () => {
      let graphData = this.lf.getGraphData();
      console.log("画布上的元素发生变化", graphData);
      const graph_data = {
        process_id: process_id.value,
        graphData: graphData
      };
      await createGraphDataRequest(graph_data);
    });
  },

  methods: {
    // 获取任务节点详情
    async getTaskDetail(data) {
      const taskResponse = await getTaskDetailRequest(data.id);
      if (taskResponse.code === 200) {
        if (!taskResponse.data) {
          ElMessage.warning("当前没有任务信息");
        }
        // 重新设置接口数据
        let task_node = taskResponse.data;
        // 设置任务配置
        const _task_config = {
          task_name: task_node.task_name,
          desc: task_node.desc,
          version: task_node.module_version,
          task_id: task_node.task_id,
          method_name: task_node.method_name,
          task_type: task_node.task_type,
          id: task_node.id,
          creator_name: userInfo.value.login_value
        };
        nodeConfig.value = _task_config;
      } else {
        ElMessage.error("获取任务信息失败");
      }
    },

    // 获取流程控制的后置节点
    async handleProcessControl(data) {
      const response = await getPCNextNodeRequest(data.id, process_id.value);
      if (response.code === 200 && response.data.length !== 0) {
        processControlOptions.value = response.data;
      } else {
        ElMessage.error("流程控制节点没有后置节点");
        return;
      }

      // 处理流程图节点
      const flowNodeResponse = await getGraphNodeDataRequest(process_id.value, nodeConfig.value.task_id);
      if (flowNodeResponse.data.nodeParam.pc_type === "result") {
        processControlResult.value = flowNodeResponse.data.nodeParam;
      } else if (flowNodeResponse.data.nodeParam.pc_type === "status") {
        processControlStatus.value = flowNodeResponse.data.nodeParam;
      }
      nodeParam.value = flowNodeResponse.data.nodeParam;
    },

    // 处理任务组节点
    async handleTaskGroup(data) {
      let _taskGroup = [];
      const children = data.children;
      children.forEach(task_id => {
        const task_name = this.lf.getNodeModelById(task_id).text.value;
        _taskGroup.push({
          task_name: task_name,
          task_id: task_id
        });
      });
      taskGroup.value = _taskGroup;
      await updateGroupTaskRequest({ task_id: data.id, method_kwargs: { group_ids: children } });
    },

    // 处理并行节点
    async handleParallel(data) {
      console.log(data);
    },

    // 修改任务节点数据
    async updateTask(data) {
      if (data.type.search("node") !== -1) {
        nodeConfig.value.task_name = data.text;
        let taskNode = {
          id: nodeConfig.value.id,
          process_id: process_id.value,
          task_name: nodeConfig.value.task_name,
          desc: nodeConfig.value.desc,
          creator_name: userInfo.value.login_value
        };
        await updateTaskRequest(taskNode);
      }
    },

    // 获取流程图数据
    async getGraphData() {
      if (process_id.value) {
        const response = await getGraphDataRequest({ process_id: process_id.value });
        if (response && response.code === 200 && response.data.length !== 0) {
          this.graphData = response.data.graphData;
        } else {
          ElMessage.warning("当前没有流程图数据");
        }
      }
    }
  }
};
</script>

<style scoped>
.edit_container {
  position: fixed;
  top: 60px;
  width: 77%;
  height: 100%;
}
.edit_flow_chart {
  position: relative;
  width: 100%;
  height: 100%;
}
.debug_container {
  position: fixed;
  top: 60px;
  width: 77%;
  height: 75%;
}
.debug_flow_chart {
  position: relative;
  width: 100%;
  height: 75%;
}
.flow-chart /deep/ .lf-red-node,
.flow-chart /deep/ .lf-element-text {
  cursor: move;
}
.flow-chart /deep/ svg {
  display: block;
}
.flow-chart-palette {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.setting-panel {
  position: absolute;
  top: 0;
  right: 0;
}
::v-deep .custom-minimap {
  background: url("data:image/png;base64,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");
  background-size: 100% 100%;
}
</style>
