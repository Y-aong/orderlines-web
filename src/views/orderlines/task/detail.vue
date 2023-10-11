<template>
  <div class="card content-box">
    <span class="text">任务详情页面 🍓🍇🍈🍉</span>
    <span class="text">params:{{ route.params }}</span>
    <span class="text">query:{{ route.query }}</span>
  </div>
</template>

<script setup lang="ts" name="taskDetail">
import { useRoute } from "vue-router";
const route = useRoute();
</script>
