<template>
  <div class="flow-chart">
    <div ref="container" class="container"></div>
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
import useTaskGroupStore from "@/stores/modules/taskGroup";
import { storeToRefs } from "pinia";
import { getProcessControlRequest } from "@/api/flow/processControl/index.ts";
import { getTaskRequest, updateTaskRequest, deleteTaskRequest } from "@/api/orderlines/task/index";
import { getFlowDataRequest, getFlowTaskDataRequest, createFlowDataRequest } from "@/api/flow/taskNode/index";
import { ElMessage } from "element-plus";
const { getFlowTaskData } = useFlowStore();
let { isRunning, process_id, nodeConfig, nodeParam, nodeResult, defaultTaskConfig, processControlOptions } =
  storeToRefs(useFlowStore());
let { taskGroup } = storeToRefs(useTaskGroupStore());

export default {
  name: "FLOW",
  setup() {
    const count = ref(0);
    const currentNode = ref(null);
    const graphData = ref(null);
    // watch(process_id, async newVal => {
    //   console.log("数据监听", newVal);
    //   const result = await getFlowDataRequest({ process_id: newVal });
    //   console.log("数据监听", result.data.graphData);
    //   graphData.value = result.data.graphData;
    //   const nodes = result.data.graphData.nodes;
    //   nodes.forEach(item => {
    //     const task_id = item.id;
    //     getFlowTaskData(newVal, task_id);
    //   });
    // });
    return {
      count,
      currentNode,
      graphData
    };
  },

  async mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: {
        visible: true,
        type: "mesh",
        size: 10,
        config: {
          color: "#eeeeee"
        }
      },
      adjustEdge: true,
      hoverOutline: false,
      edgeSelectedOutline: false,
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: ["backspace", "Del"],
            callback: () => {
              const r = window.confirm("确定要删除吗？");
              if (r) {
                const elements = this.lf.getSelectElements(true);
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
    // 获取流程图数据
    await this.getGraphData();
    this.lf.render(this.graphData);
    // 文本更新监听
    this.lf.on("text:update", async data => {
      if (data.type.search("node") !== -1) {
        nodeConfig.value.task_name = data.text;
        let taskNode = {
          id: nodeConfig.value.id,
          process_id: process_id.value,
          task_name: nodeConfig.value.task_name,
          desc: nodeConfig.value.desc
        };
        await updateTaskRequest(taskNode);
      }
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
      const taskResponse = await getTaskRequest({ task_id: data.id });
      if (taskResponse.code === 200) {
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
          id: task_node.id
        };
        nodeConfig.value = _task_config;
      } else {
        ElMessage.error("获取任务信息失败");
      }
      // 获取流程控制节点的后续节点
      if (data.type === "process-control-node") {
        console.log("流程控制");
        let pcResponse = await getProcessControlRequest(data.id, process_id.value);
        if (pcResponse.code === 200) {
          processControlOptions.value = pcResponse.data;
        } else {
          ElMessage.error("流程控制节点没有前置节点");
        }
        // 获取流程图的返回
        const taskFlowResponse = await getFlowTaskDataRequest(process_id.value, nodeConfig.value.task_id);
        nodeParam.value = taskFlowResponse.data.nodeParam;
      } else if (data.type === "group-node") {
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
      } else {
        // 获取节点的展示数据
        await getFlowTaskData(process_id.value, data.id);
      }
    });
    // 画布上的元素发生变化
    this.lf.on("history:change", async () => {
      let graphData = this.lf.getGraphData();
      console.log("画布上的元素发生变化", graphData);
      isRunning.value = false;
      const flow_data = {
        process_id: process_id.value,
        graphData: graphData
      };
      await createFlowDataRequest(flow_data);
    });
  },
  methods: {
    async getGraphData() {
      if (process_id.value) {
        const result = await getFlowDataRequest({ process_id: process_id.value });
        if (result && result.code === 200) {
          this.graphData = result.data.graphData;
        }
      }
    }
  }
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 60px;
  width: 77%;
  height: 100%;
}
.flow-chart {
  position: relative;
  width: 100%;
  height: 100%;
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
