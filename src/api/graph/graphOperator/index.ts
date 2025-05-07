import http from "@/api";
import { BaseData } from "@/api/interface";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import { GraphOperator } from "./type";

enum API {
  PROCESS_VERSION = "/graph/process_version",
  SETUP_TEARDOWN_PARAM = "/graph/setup_teardown/params",
  SUB_PROCESS_PARAM_URL = "/graph/sub_process/params"
}

// 获取子流程参数
export const getSubProcess = (process_id: string) =>
  http.get<GraphOperator.SubprocessParmaType[]>(`${API.SUB_PROCESS_PARAM_URL}?process_id=${process_id}`);

// 修改子流程参数
export const updateSubProcess = (sub_process: GraphOperator.SubprocessParmaType) =>
  http.post<BaseData>(API.SUB_PROCESS_PARAM_URL, sub_process);

// 创建流程版本
export const createProcessVersionRequest = (data: Process.ProcessItem) =>
  http.post<GraphOperator.CreateProcessVersion>(API.PROCESS_VERSION, data, { loading: true });

// 获取流程版本
export const getProcessVersionByIDRequest = (process_id: string) =>
  http.get<GraphOperator.ProcessVersionType>(`${API.PROCESS_VERSION}?process_id=${process_id}`);

// 根据流程名称获取流程版本
export const getProcessVersionByNameRequest = (process_name: string) =>
  http.get<GraphOperator.ProcessVersionType[]>(`${API.PROCESS_VERSION}?process_name=${process_name}`);

// 获取setup/teardown参数
export const getSetupTearDownParamRequest = (name: string) =>
  http.get<Process.ProcessConfig>(`${API.SETUP_TEARDOWN_PARAM}?name=${name}`);
