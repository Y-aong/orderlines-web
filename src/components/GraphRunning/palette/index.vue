<template>
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
            <el-menu-item :index="item.text" v-if="!node.nodes[0].nodes">
              <el-button class="title" plain>{{ item.text }}</el-button>
            </el-menu-item>
          </div>
        </template>
        <!-- category -->
        <template v-if="node.nodes[0].nodes">
          <template v-for="item in node.nodes" :key="item.title">
            <el-sub-menu :index="item.title">
              <template #title>{{ item.title }}</template>
              <div class="node-form draggable draggable-handle" v-for="temp in item.nodes" :key="temp.text">
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
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import useGraphStore from "@/stores/modules/graph.js";

let { getNodeMenu } = useGraphStore();
let { nodeMenu } = storeToRefs(useGraphStore());

onMounted(async () => {
  let nodeMenuData = await getNodeMenu();
  nodeMenu.value = nodeMenuData;
});
</script>

<script lang="ts">
export default {
  name: "Palette"
};
</script>

<style scoped lang="scss">
// menu 高度设置
:deep(.el-sub-menu__title) {
  height: 48px !important;
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
</style>
