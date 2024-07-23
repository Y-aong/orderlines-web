import http from "@/api";
import { DataScreen } from "./type";

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

export const getBaseInfoRequest = () => http.get<DataScreen.BaseInfoType>(API.BASE_INFO_URL);
export const getPluginInfoRequest = () => http.get<DataScreen.PluginUseType[]>(API.PLUGIN_INFO_URL);
export const getProcessAlarmRequest = () => http.get<DataScreen.ProcessAlarmType>(API.PROCESS_ALARM_URL);
export const getProcessStatusRequest = () => http.get<DataScreen.ProcessStatusType>(API.PROCESS_STATUS_URL);
export const getRunningCountRequest = () => http.get<DataScreen.RunningCountType>(API.RUNNING_COUNT_URL);
export const getRunningTrendRequest = () => http.get<DataScreen.RunningInfoType>(API.RUNNING_TREND_URL);
export const getTriggerTypeRequest = () => http.get<DataScreen.TriggerType>(API.TRIGGER_TYPE_URL);
export const getRunningInfoRequest = () => http.get<DataScreen.RunningInfoType>(API.RUNNING_INFO_URL);
