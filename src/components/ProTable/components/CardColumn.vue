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
            width: props.cardLayout?.width,
            height: props.cardLayout?.height
          }"
        >
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span v-if="props.cardTitle">{{ row[props.cardTitle] }}</span>
                <span v-else>标题未定义</span>
                <div>
                  <el-button size="small" :icon="View" @click="props.selectItem('查看', row)" v-if="props.selectItem" />
                  <el-button size="small" :icon="Edit" @click="props.updateItem('编辑', row)" v-if="props.updateItem" />
                  <el-button size="small" :icon="Delete" @click="deleteItem(row)" v-if="props.deleteItem" />
                </div>
              </div>
            </template>
            <div class="card-context">
              <div>
                <div v-for="(card, i) in props.cardColumn" :key="i" style="width: 240px">
                  <el-text class="w-270px mb-2" line-clamp="2" truncated>
                    {{ card.label + "：" }}{{ row[card.value] ? row[card.value] : "" }}
                  </el-text>
                </div>
              </div>

              <UploadImg v-if="row.img_url" v-model:image-url="row.img_url" width="100px" height="100px" :file-size="3">
                <template #tip> </template>
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
import { cardLayoutProps, cardProps } from "../interface";
interface Props {
  tableData: any;
  cardColumn?: cardProps[];
  cardTitle?: string;
  cardLayout?: cardLayoutProps;
  selectItem?: any;
  updateItem?: any;
  deleteItem?: any;
}
const props = defineProps<Props>();
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
  height: 90%;
  overflow: auto;
}
.cards::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
