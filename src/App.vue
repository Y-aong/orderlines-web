<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { getBrowserLang } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import { ElConfigProvider } from "element-plus";
import { LanguageType } from "./stores/interface";
import { useGlobalStore } from "@/stores/modules/global";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { checkTokenApi, getUserInfoApi } from "@/api/modules/login";
import { Login } from "@/api/interface/index";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { BaseResponse } from "./api/interface";

const globalStore = useGlobalStore();
const { initTheme } = useTheme();
const i18n = useI18n();

let timeoutId: ReturnType<typeof setTimeout> | null = null; // 明确指定timeoutId的类型
let { token, userInfo } = storeToRefs(useUserStore());

// init theme
initTheme();
// init language
onMounted(() => {
  const language = globalStore.language ?? getBrowserLang();
  i18n.locale.value = language;
  globalStore.setGlobalState("language", language as LanguageType);
  scheduleRefresh();
});

// element language
const locale = computed(() => {
  if (globalStore.language == "zh") return zhCn;
  if (globalStore.language == "en") return en;
  return getBrowserLang() == "zh" ? zhCn : en;
});

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });

// 定时刷新token
const scheduleRefresh = () => {
  timeoutId = setTimeout(async () => {
    const response = await checkTokenApi(token.value);

    if (response.code == 200 || token.value !== response.data.token) {
      token.value = response.data.token;
    }
    const userInfoResponse: BaseResponse<Login.ResUserInfo> = await getUserInfoApi(token.value);
    const webUserInfo: Login.ResUserInfo = {
      login_type: userInfoResponse.data.login_type,
      login_value: userInfoResponse.data.login_value
    };
    userInfo.value = webUserInfo;
  }, 30000);
};

onUnmounted(() => {
  clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
});
</script>
