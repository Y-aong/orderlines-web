<template>
  <el-collapse-item title="任务运行图片" name="runningImage">
    <UploadImg v-model:image-url="img_url" width="270px" height="180px" :file-size="3"> </UploadImg>
  </el-collapse-item>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
const img_url = ref("https://cdn.pixabay.com/photo/2023/10/06/07/14/plant-8297610_1280.jpg");
</script>
<script lang="ts">
export default {
  name: "TaskResultParam"
};
</script>

<style scoped></style>
