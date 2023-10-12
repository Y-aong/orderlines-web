<template>
  <div class="card content-box">
    <span class="text"> 系统日志（待完善） 🍓🍇🍈🍉</span>

    <el-table :data="tableData" style="width: 90%">
      <el-table-column label="">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="always"> Always </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover"> Hover </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="never"> Never </el-card>
          </el-col>
        </el-row>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="systemLog">
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
];
</script>
<style>
.time {
  font-size: 12px;
  color: #999999;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 13px;
  line-height: 12px;
}
.button {
  min-height: auto;
  padding: 0;
}
.image {
  display: block;
  width: 100%;
}
</style>
