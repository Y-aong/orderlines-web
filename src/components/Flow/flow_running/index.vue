<template>
  <div class="flow-chart">
    <div ref="container" class="container"></div>
  </div>
</template>

<script lang="js">
import { ref } from "vue";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import OrderlinesNodeExtension from "../index.js";
import { Control, Group, MiniMap, InsertNodeInPolyline, Menu } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
import "@/components/Flow/style.css";
import useFlowStore from "../../../stores/modules/flow";
import { storeToRefs } from "pinia";
import { getFlowDataRequest } from "@/api/flow/index.ts";

let { process_id } = storeToRefs(useFlowStore());

export default {
  name: "FlowRunning",
  setup() {
    const count = ref(0);
    const currentNode = ref(null);
    return {
      count,
      currentNode
    };
  },

  async mounted() {
    try {
      this.lf = new LogicFlow({
        container: this.$refs.container,
        // 设置静默模式，不可以编辑
        isSilentMode: true,
        grid: {
          size: 18,
          visible: true,
          type: "dot",
          config: {
            color: "#ababab",
            thickness: 1
          }
        },
        background: {
          backgroundColor: "rgb(255,255,255)",
          backgroundOpacity: 100
        },
        hoverOutline: false,
        edgeSelectedOutline: false,
        plugins: [OrderlinesNodeExtension, Control, Group, MiniMap, InsertNodeInPolyline, Menu]
      });
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
    } catch (e) {}
  },
  methods: {
    async getGraphData() {
      const result = await getFlowDataRequest(process_id.value);
      if (result.code === 200) {
        this.graphData = result.data.graphData;
      } else {
        this.graphData = [];
        console.log("this.graphData", this.graphData);
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
</style>
