<template>
  <div class="flow_tabbar">
    <FlowTabbar />
  </div>
  <div class="container">
    <el-card class="web-filter">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="序号">
          <el-input v-model="input1" placeholder="Approved by" clearable />
        </el-form-item>
        <el-form-item label="步骤名称">
          <el-input v-model="input1" placeholder="Approved by" clearable />
        </el-form-item>
        <el-form-item label="功能名称">
          <el-select v-model="input1" placeholder="Activity zone" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知人">
          <el-input v-model="input1" placeholder="Approved by" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="web-main">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        max-height="710"
        :border="true"
        stripe
        :show-header="true"
        highlight-current-row
      >
        <el-table-column fixed prop="name" label="序号" width="100" align="center" />
        <el-table-column prop="date" label="步骤名称" width="150" align="center" />
        <el-table-column prop="name" label="执行功能" width="150" align="center" />
        <el-table-column prop="state" label="执行参数" align="center" />
        <el-table-column prop="date" label="断言" align="center" />
        <el-table-column prop="city" label="通知人" width="120" align="center" />
        <el-table-column prop="date" label="步骤备注" width="150" align="center" />

        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)"> 删除步骤 </el-button>
            <el-button link type="primary" size="small" @click="onAddItem">增加步骤</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <div class="running_right">
    <FlowRightSidebar />
  </div>
</template>

<script lang="ts" setup name="Web">
import FlowTabbar from "../components/tabbar/index.vue";
import FlowRightSidebar from "../components/rightSidebar/index.vue";
import { ref } from "vue";
import dayjs from "dayjs";
const now = new Date();

const input1 = ref("");

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
.container {
  position: fixed;
  top: 60px;
  left: 0;
  width: 75%;
  height: 100vh;
  background: "241, 242, 244";
}
.flow_tabbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
}
.running_right {
  position: fixed;
  top: 0;
  left: 75%;
  width: 25%;
  height: 80vh;
  background-color: #fdfdfd;
}
.web-filter {
  width: 98%;
  height: 70px;
  margin: 10px auto;
}
.web-main {
  width: 98%;
  height: calc(100% - 170px);
  margin: 10px auto;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
