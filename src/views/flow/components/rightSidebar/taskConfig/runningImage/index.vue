<template>
  <h3>任务运行</h3>
  <div class="task-progress">
    <el-progress
      :percentage="taskProgress"
      :stroke-width="20"
      striped
      :text-inside="true"
      striped-flow
      status="success"
      :duration="8"
      style="width: 100%"
    />
  </div>

  <el-collapse-item title="任务运行图片" name="runningImage">
    <div style="margin: auto">
      <ImgCheck v-model:image-url="img_url" width="270px" height="180px" :file-size="3"> </ImgCheck>
    </div>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImgCheck from "@/components/Upload/ImgCheck.vue";
import useFlowStore from "@/stores/modules/flow";
import { storeToRefs } from "pinia";

let { taskProgress } = storeToRefs(useFlowStore());

const img_url = ref("https://cdn.pixabay.com/photo/2023/10/06/07/14/plant-8297610_1280.jpg");
</script>
<script lang="ts">
export default {
  name: "TaskResultParam"
};
</script>

<style scoped>
.task-progress {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
span {
  font-size: 14px;
  font-weight: bolder;
}
</style>
