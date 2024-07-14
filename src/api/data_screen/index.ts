import http from "@/api";

//项目用户相关的请求地址
enum API {
  BASE_INFO_URL = "/data_screen/base_info",
  PLUGIN_INFO_URL = "/data_screen/plugin_use",
  PROCESS_ALARM_URL = "/data_screen/process_alarm",
  PROCESS_STATUS_URL = "/data_screen/process_status",
  RUNNING_COUNT_URL = "/data_screen/running_count",
  RUNNING_TREND_URL = "/data_screen/run_trend",
  TRIGGER_TYPE_URL = "/data_screen/trigger_type",
  RUNNING_INFO_URL = "/data_screen/running_info"
}

export const getBaseInfoRequest = () => http.get(API.BASE_INFO_URL);
export const getPluginInfoRequest = () => http.get(API.PLUGIN_INFO_URL);
export const getProcessAlarmRequest = () => http.get(API.PROCESS_ALARM_URL);
export const getProcessStatusRequest = () => http.get(API.PROCESS_STATUS_URL);
export const getRunningCountRequest = () => http.get(API.RUNNING_COUNT_URL);
export const getRunningTrendRequest = () => http.get(API.RUNNING_TREND_URL);
export const getTriggerTypeRequest = () => http.get(API.TRIGGER_TYPE_URL);
export const getRunningInfoRequest = () => http.get(API.RUNNING_INFO_URL);
