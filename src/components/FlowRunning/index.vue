<template>
  <div class="flow-chart">
    <div ref="runningContainer" class="container"></div>
  </div>
</template>

<script lang="js">
import { ref } from "vue";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import OrderlinesNodeExtension from "./index.js";
import { Control, Group, MiniMap, InsertNodeInPolyline, Menu } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
import "@/components/Flow/style.css";
import useFlowStore from "../../stores/modules/flow";
import useRunningTaskStore from "../../stores/modules/runningTask";
import { storeToRefs } from "pinia";
import { getTaskInstanceItem } from "@/api/orderlines/orderlinesManager/taskInstance/index";

let { process_instance_id } = storeToRefs(useFlowStore());
let { clickCheckTask, running_edge, graph_data } = storeToRefs(useRunningTaskStore());

export default {
  name: "FlowRunning",
  setup() {
    let timer = "";
    const count = ref(0);
    const currentNode = ref(null);
    return {
      count,
      currentNode,
      timer
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
      let res = await getTaskInstanceItem(process_instance_id.value, data.id);
      clickCheckTask.value = res.data;
    });
    // 获取流程图数据
    await this.getGraphData();
    await this.lf.render(this.graphData);
    await this.runningTask(this.lf);
  },
  onUnmounted() {
    clearInterval(this.timer);
  },
  onBeforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    async getGraphData() {
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
</style>
