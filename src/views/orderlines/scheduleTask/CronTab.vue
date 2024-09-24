<template>
  <el-form :model="cronForm" ref="cronFormRef" label-width="120px">
    <el-form-item label="分钟" prop="minutes">
      <el-select v-model="cronForm.minutes" placeholder="选择分钟">
        <el-option v-for="minute in minutesOptions" :key="minute.value" :label="minute.label" :value="minute.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="小时" prop="hours">
      <el-select v-model="cronForm.hours" placeholder="选择小时">
        <el-option v-for="hour in hoursOptions" :key="hour.value" :label="hour.label" :value="hour.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="日" prop="daysOfMonth">
      <el-select v-model="cronForm.daysOfMonth" placeholder="选择日">
        <el-option v-for="day in daysOfMonthOptions" :key="day.value" :label="day.label" :value="day.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="月" prop="months">
      <el-select v-model="cronForm.months" placeholder="选择月">
        <el-option v-for="month in monthsOptions" :key="month.value" :label="month.label" :value="month.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="星期" prop="daysOfWeek">
      <el-select v-model="cronForm.daysOfWeek" placeholder="选择星期">
        <el-option v-for="day in daysOfWeekOptions" :key="day.value" :label="day.label" :value="day.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="generateCron">Cron表达式预览</el-button>
      <el-button @click="clearForm">清空</el-button>
    </el-form-item>
    <el-form-item>
      <div>{{ cronExpression }}</div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

// 定义选项
const minutesOptions = Array.from({ length: 60 }, (_, i) => ({ value: i.toString(), label: i }));
const hoursOptions = Array.from({ length: 24 }, (_, i) => ({ value: i.toString(), label: i }));
const daysOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({ value: (i + 1).toString(), label: i + 1 }));
const monthsOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" }
];
const daysOfWeekOptions = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" }
];

// 定义表单数据
const cronForm = reactive<any>({
  minutes: "",
  hours: "",
  daysOfMonth: "",
  months: "",
  daysOfWeek: ""
});

// 生成cron表达式
const cronExpression = ref("");
const generateCron = () => {
  cronExpression.value = `${cronForm.minutes} ${cronForm.hours} ${cronForm.daysOfMonth} ${cronForm.months} ${cronForm.daysOfWeek}`;
};

// 清空表单
const clearForm = () => {
  Object.keys(cronForm).forEach(key => {
    cronForm[key] = "";
  });
  cronExpression.value = "";
  ElMessage.success("已清空");
};
</script>
