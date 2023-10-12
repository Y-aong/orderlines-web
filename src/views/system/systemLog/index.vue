<template>
  <div class="">
    <h3>系统日志（待完善） 🍓🍇🍈🍉</h3>
    <div class="card-box" v-for="index in 12" :key="index">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name {{ index }}</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 2" :key="o" class="text item">{{ "List item " + o }}</div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="systemLog"></script>
<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.box-card {
  width: 620px;
  height: 350px;
  margin: 12px 8px;
}
.card-box {
  display: flex;
  float: left;
}
</style>
