<template>
  <codemirror
    v-model="code"
    placeholder="请输入你的python代码"
    :style="{ height: '400px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="4"
    :extensions="extensions"
    @blur="getCode(code)"
  />
</template>

<script lang="js" setup name="Code">
import { Codemirror } from "vue-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

import { ref } from "vue";
const defaultPythonCode = `from orderlines.variable.variable_handler import set_variable, get_variable
# 设置变量
# set_variable(variable_key, variable_value, variable_type, task_instance_id)
# eg: task_instance_id 为全局变量直接写即可
# set_variable('v1', 123, 'int', task_instance_id)
# 获取变量值
# get_variable(variable_key, task_instance_id)
# eg: task_instance_id 为全局变量直接写即可；variable_key必须为上面已经声明过的变量key
# value = get_variable('v1', task_instance_id)
# print(f"variable_value::{value}")`;

const code = ref(defaultPythonCode);
const extensions = [python(), oneDark];

defineProps({
  getCode: { type: Function }
});
</script>
