<template>
  <div class="real-time-process">
    <el-row>
      <el-col>
        <div class="statistic-card">
          <div class="statistic-font">
            <img src="../images/robot.svg" alt="" class="load-img" />
            测试流程1
          </div>
        </div>
        <div class="statistic-card">
          <div class="statistic-font">
            <img src="../images/robot.svg" alt="" class="load-img" />
            测试流程2
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.real-time-process {
  width: 100%;
  height: 100%;
  background: #19182a;
}
.statistic-card {
  display: block;
  width: 80%;
  height: 30px;
  padding-bottom: 5px;
  margin: 10px auto;
  font-family: YouSheBiaoTiHei;
  font-size: 20px;
  color: #eeeeee;
  background: url("../images/dataScreen-warn-bg.png") no-repeat;
}
.load-img {
  width: 20px;
  height: 20px;
  margin-top: 5px;
  margin-left: 5px;
}
</style>
