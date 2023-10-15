<template>
  <div class="cards">
    <el-row :gutter="15">
      <el-col
        :xs="props.cardLayout ? props.cardLayout.xs : 24"
        :sm="props.cardLayout ? props.cardLayout.sm : 24"
        :md="props.cardLayout ? props.cardLayout.md : 12"
        :lg="props.cardLayout ? props.cardLayout.lg : 8"
        :xl="props.cardLayout ? props.cardLayout.xl : 6"
        v-for="(row, index) in props.tableData"
        :key="index"
      >
        <div
          :style="{
            width: props.cardLayout.width,
            height: props.cardLayout.height
          }"
        >
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span> {{ row[cardTitle] }}</span>
                <div>
                  <el-button size="small" :icon="View" @click="props.selectItem('查看', row)" />
                  <el-button size="small" :icon="Edit" @click="props.updateItem('编辑', row)" />
                  <el-button size="small" :icon="Delete" @click="deleteItem(row)" />
                </div>
              </div>
            </template>
            <div class="card-context">
              <div>
                <div v-for="(card, i) in props.cardColumn" :key="i">
                  <el-text truncated>{{ card.label + "：" }}{{ row[card.value] ? row[card.value] : "" }}</el-text>
                </div>
              </div>

              <UploadImg v-if="row.img_url" v-model:image-url="row.img_url" width="180px" height="180px" :file-size="3">
                <template #tip> 图片大小不能超过 3M </template>
              </UploadImg>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="CardColumn">
import { defineProps } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { Edit, View, Delete } from "@element-plus/icons-vue";
// eslint-disable-next-line vue/require-prop-types
const props = defineProps([
  "tableData",
  "cardColumn",
  "cardTitle",
  "cardLayout",
  "selectItem",
  "updateItem",
  "deleteItem"
]);
</script>
<style scoped lang="scss">
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
  font-size: 15px;
}
.cards {
  // height: 90%;
  max-height: 90%;
  overflow: auto;
}
.cards::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
