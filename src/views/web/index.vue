<template>
  <el-card class="web-filter"> </el-card>
  <el-card class="web-main">
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="100%"
      border="true"
      stripe
      show-header="trues"
      highlight-current-row
    >
      <el-table-column fixed prop="date" label="序号" width="150" align="center" />
      <el-table-column prop="date" label="步骤名称" width="150" align="center" />
      <el-table-column prop="name" label="执行功能" width="120" align="center" />
      <el-table-column prop="state" label="执行参数" width="240" align="center" />
      <el-table-column prop="city" label="通知人" width="120" align="center" />
      <el-table-column prop="date" label="断言" width="150" align="center" />
      <el-table-column prop="date" label="步骤备注" width="150" align="center" />

      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)"> 删除步骤 </el-button>
          <el-button link type="primary" size="small" @click="onAddItem">增加步骤</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import dayjs from "dayjs";

const now = new Date();

const tableData = ref([
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  }
]);

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1);
};

const onAddItem = () => {
  now.setDate(now.getDate() + 1);
  tableData.value.push({
    date: dayjs(now).format("YYYY-MM-DD"),
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  });
};
</script>

<style scoped>
.web-filter {
  width: 100%;
  height: 50px;
}
</style>
