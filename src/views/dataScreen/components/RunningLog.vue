<template>
  <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
    <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
  </ul>
</template>

<script lang="ts" setup name="RunningLog">
import { ref } from "vue";
const count = ref(0);
const load = () => {
  count.value += 2;
};
</script>

<style>
.infinite-list {
  height: 600px;
  padding-top: 10px;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  margin: 10px;
  color: var(--el-color-primary);
  background: #ffffff;
  border-radius: 5px;
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 20px;
}
</style>
