<template>
  <div class="real-time-process">
    <el-row :gutter="16">
      <el-col :span="21">
        <div class="statistic-card">
          <el-statistic :value="98500">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one day"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12"> </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>yesterday</span>
              <span class="green">
                24%
                <el-icon>
                  <CaretTop />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { CaretTop } from "@element-plus/icons-vue";
</script>

<style scoped>
.real-time-process {
  width: 100%;
  height: 100%;
  background: bisque;
}
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}
.el-statistic {
  --el-statistic-content-font-size: 28px;
}
.statistic-card {
  width: 100%;
  height: 35%;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 4px;
}
.statistic-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
.statistic-footer .footer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}
.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
