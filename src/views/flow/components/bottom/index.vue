<template>
  <div class="flow-bottom">
    <div class="card-header">
      运行日志
      <el-button :icon="View" circle @click="showDialog" plain size="small" />
    </div>

    <div class="card-context" style="height: 60%">
      <el-scrollbar>
        <pre v-for="log in debugMessage" :key="log.time" class="scrollbar-demo-item" :class="log.level">
          [{{ log.level }}] {{ log.time }}——{{ log.msg }}
        </pre>
      </el-scrollbar>
    </div>
  </div>

  <el-dialog title="运行日志" v-model="isShowDialog" style="width: 50%; margin-left: 12%">
    <template #header>
      <div class="logger-header">
        <h4>运行日志</h4>
      </div>
    </template>
    <div class="card-context" style="height: 500px">
      <el-scrollbar>
        <pre v-for="log in debugMessage" :key="log.time" class="scrollbar-demo-item" :class="log.level">
          [{{ log.level }}] {{ log.time }}——{{ log.msg }}
        </pre>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="FlowBottom">
import { storeToRefs } from "pinia";
import "vue3-json-viewer/dist/index.css";
import useDebugStore from "@/stores/modules/debug";
import { ref } from "vue";
import { View } from "@element-plus/icons-vue";

const isShowDialog = ref(false);
const { debugMessage } = storeToRefs(useDebugStore());

const showDialog = () => {
  isShowDialog.value = !isShowDialog.value;
};
</script>

<style scoped lang="scss">
.logger-dialog {
  position: absolute;
  top: 100px;
  width: 100%;
  height: 50%;
}
.logger-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
}
.flow-bottom {
  position: absolute;
  left: 210px;
  width: 85%;
  height: 24%;
}
.card-header {
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
}
.card-context {
  width: 100%;
  font-size: 12px;
  text-align: left;
}
.scrollbar-demo-item {
  display: flex;
  justify-content: space-between;
  line-height: 10px;
  text-align: left;
  word-break: break-word; /* 允许单词内部换行 */
}
.error {
  color: red;
}
.warn {
  color: orange;
}
.info {
  color: var(--el-color-primary);
}
</style>
