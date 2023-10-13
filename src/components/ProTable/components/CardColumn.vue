<template>
  <div class="cards">
    <div class="card-box" v-for="(row, index) in props.tableData" :key="index">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span> {{ row[cardTitle] }}</span>
            <div>
              <el-button size="small" :icon="View" />
              <el-button size="small" :icon="Edit" />
              <el-button size="small" :icon="Delete" />
            </div>
          </div>
        </template>
        <div class="card-context">
          <div>
            <div v-for="(card, i) in props.cardColumn" :key="i">
              <el-text truncated>{{ card.label + "：" + row[card.value] }}</el-text>
            </div>
          </div>

          <UploadImg v-if="row.img_url" v-model:image-url="row.img_url" width="180px" height="180px" :file-size="3">
            <template #tip> 图片大小不能超过 3M </template>
          </UploadImg>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="CardColumn">
import { defineProps } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { Edit, View, Delete } from "@element-plus/icons-vue";
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(["tableData", "cardColumn", "cardTitle"]);
</script>
<style scoped lang="scss">
.cards {
  display: flex;
  height: 90vh;
}
.card-box {
  position: relative;
  display: flex;
  float: left;
  .box-card {
    width: 460px;
    height: 300px;
    margin: 15px 10px;
    border-radius: 10px;
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      font-weight: bold;
    }
    .card-context {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 230px;
      font-size: 15px;
      line-height: 1.5;
    }
  }
}
</style>
