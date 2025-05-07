<template>
  <div class="flow-chart">
    <div ref="runningContainer" class="container"></div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import OrderlinesNodeExtension from "./index.js";
import { Control, Group, MiniMap, InsertNodeInPolyline, Menu } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
import "@/components/GraphRunning/style.css";
import useGraphStore from "@/stores/modules/graph";
import useRunningTaskStore from "@/stores/modules/runningTask";
import { storeToRefs } from "pinia";
import { getTaskInstanceItem } from "@/api/orderlines/orderlinesManager/taskInstance/index";
import { getGraphInstanceRequest } from "@/api/graph/graphData/index";

let { process_instance_id } = storeToRefs(useGraphStore());
let { clickCheckTask, running_edge, graph_data, taskProgress } = storeToRefs(useRunningTaskStore());

export default {
  name: "GraphRunning",
  setup() {
    const currentNode = ref(null);
    return {
      currentNode
    };
  },

  async mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.runningContainer,
      // 设置静默模式，不可以编辑
      isSilentMode: true,
      grid: {
        visible: true,
        type: "dot",
        size: 10,
        config: {
          color: "#eeeeee"
        }
      },
      background: {
        backgroundColor: "rgb(255,255,255)",
        backgroundOpacity: 100
      },
      hoverOutline: false,
      edgeSelectedOutline: false,
      plugins: [Control, Group, MiniMap, InsertNodeInPolyline, Menu, OrderlinesNodeExtension]
    });
    // 增加导航;
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
    this.lf.on("node:click", async ({ data }) => {
      const response = await getTaskInstanceItem(process_instance_id.value, data.id);
      if (response.code == 200) {
        clickCheckTask.value = {
          ...response.data,
          task_result: response.data.task_result ?? null
        };
      }
    });
    // // 增加菜单选项
    // this.lf.extension.menu.addMenuConfig({
    //   nodeMenu: [
    //     {
    //       text: "添加断点",
    //       callback: async node => {
    //         const properties = this.lf.getProperties(node.id);
    //         if (properties.breakpoint) {
    //           ElMessage.warning("该节点已设置断点！");
    //           return;
    //         }
    //         const result = await taskBreakpointRequest(node.id, 1);
    //         if (result.code == 200) ElMessage.success("设置断点成功！");
    //         // 增加节点断点状态
    //         this.lf.setProperties(node.id, { breakpoint: true });
    //       }
    //     },
    //     {
    //       text: "删除断点",
    //       callback: async node => {
    //         const properties = this.lf.getProperties(node.id);
    //         if (!properties.breakpoint) {
    //           ElMessage.warning("该节点已取消断点！");
    //           return;
    //         }
    //         const result = await taskBreakpointRequest(node.id, 0);
    //         if (result.code == 200) ElMessage.success("取消断点成功！");
    //         // 删除断点
    //         this.lf.setProperties(node.id, { breakpoint: false });
    //       }
    //     }
    //   ]
    // });
    // 获取流程图数据
    await this.getGraphData();
    await this.lf.render(this.graphData);
    await this.runningTask(this.lf);
  },

  methods: {
    async getGraphData() {
      const filter = { process_instance_id: process_instance_id.value };
      const response: any = await getGraphInstanceRequest(filter);
      if (response.code === 200 && response.data.graph_data) {
        graph_data.value = response.data.graph_data.graphData;
        taskProgress.value = response.data.task_progress;
        running_edge.value = response.data.running_edge;
        this.graphData = graph_data.value;
      } else {
        this.graphData = {};
      }

      this.graphData = graph_data.value;
    },
    async runningTask(flow) {
      this.timer = setInterval(async () => {
        this.graphData = graph_data.value;
        await flow.render(this.graphData);
        let edgeIds = running_edge.value;
        edgeIds.forEach(item => {
          flow.openEdgeAnimation(item);
        });
      }, 1000);
    }
  }
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 60px;
  width: 75%;
  height: 75%;
}
.flow-chart {
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
</style>
