<template>
  <el-collapse-item title="任务运行图片" name="runningImage">
    <div style="margin: auto">
      <ImgCheck v-model:image-url="img_url" width="310px" height="210px" :file-size="3"> </ImgCheck>
    </div>
  </el-collapse-item>
</template>

<script setup lang="ts" name="TaskResultParam">
import { ref } from "vue";
import ImgCheck from "@/components/Upload/ImgCheck.vue";

const img_url = ref("https://cdn.pixabay.com/photo/2023/10/06/07/14/plant-8297610_1280.jpg");
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
