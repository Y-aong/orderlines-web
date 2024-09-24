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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import useFlowStore from "@/stores/modules/flow";
import { storeToRefs } from "pinia";

let { getNodeMenu } = useFlowStore();
let { nodeMenu } = storeToRefs(useFlowStore());

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
