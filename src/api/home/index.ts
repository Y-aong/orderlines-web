import http from "@/api";

//项目用户相关的请求地址
enum API {
  RUN_NUMBER = "/home/run_number",
  ALARM_COUNT = "/home/alarm_count",
  CURVE_DATA = "/home/curve_data"
}

export const getRunNumber = () => http.get(API.RUN_NUMBER);
export const getAlarmCount = () => http.get(API.ALARM_COUNT);
export const getCurveData = (date: string) => http.get(`${API.CURVE_DATA}?date=${date}`);
