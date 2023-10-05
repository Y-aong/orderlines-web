<template>
  <div class="demo-collapse" :style="properties.style">
    <div>当前值：{{ text }}</div>
    <div class="demo-operator">
      <el-input @keydown.stop type="text" v-model="increaseFactor" />
      <el-button @mousedown.stop @click="$emit('btnClick', increaseFactor)">增加</el-button>
    </div>
  </div>
</template>

<script lang="js">
export default {
  name: "TaskNode",
  props: {
    properties: {
      type: Object,
      default: () => ({
        t: 1,
        style: {}
      })
    },
    text: String
  },
  data() {
    return {
      showTitle: "",
      increaseFactor: 0
    };
  },
  emits: ["btnClick"],
  mounted() {
    console.log(this);
  },
  watch: {
    "properties.t": {
      handler(val) {
        this.increaseFactor = val;
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
