<template>
  <div>
    <div>
      <el-button @click="changeCardStyle"> 切换样式</el-button>
    </div>
    <template v-if="!isCard">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </template>
    <template v-if="isCard">
      <div class="card-box" v-for="(row, index) in tableData" :key="index">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>卡片名称 {{ row.name }}</span>
              <div>
                <el-button size="small" :icon="View" />
                <el-button size="small" :icon="Edit" />
                <el-button size="small" :icon="Delete" />
              </div>
            </div>
          </template>
          <div class="card-context">
            <div>
              <div v-for="(card, i) in cardLabel" :key="i">
                {{ card.label + "：" + row[card.value] }}
              </div>
            </div>
            <UploadImg v-model:image-url="row.img_url" width="180px" height="180px" :file-size="3">
              <template #tip> 图片大小不能超过 3M </template>
            </UploadImg>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" name="systemLog">
import { ref } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { Edit, View, Delete } from "@element-plus/icons-vue";

const isCard = ref<boolean>(false);
const tableData = ref<any>([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "中国上海",
    img_url: "https://tupian.qqw21.com/article/UploadPic/2020-8/20208522181014944.jpg"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "中国香港",
    img_url: "https://tupian.qqw21.com/article/UploadPic/2020-8/20208522181014944.jpg"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "美国纽约",
    img_url: "https://tupian.qqw21.com/article/UploadPic/2020-8/20208522181014944.jpg"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "巴勒斯坦加沙",
    img_url: "https://tupian.qqw21.com/article/UploadPic/2020-8/20208522181014944.jpg"
  }
]);

const cardLabel = [
  {
    label: "姓名",
    value: "name"
  },
  {
    label: "时间",
    value: "date"
  },
  {
    label: "地址",
    value: "address"
  }
];

const changeCardStyle = () => {
  isCard.value = !isCard.value;
};
</script>
<style scoped lang="scss">
.card-box {
  position: relative;
  display: flex;
  float: left;
  .box-card {
    width: 468px;
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
      font-size: 14px;
    }
  }
}
</style>
