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

const code = ref(`print('Hello, world!')`);
const extensions = [python(), oneDark];

defineProps({
  getCode: { type: Function }
});
</script>
