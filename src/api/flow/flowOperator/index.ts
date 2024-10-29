import http from "@/api";
import { BaseData } from "@/api/interface";
import { Process } from "@/api/orderlines/orderlinesManager/process/type";
import { FlowOperator } from "./type";

enum API {
  PROCESS_VERSION = "/graph/process_version",
  SETUP_TEARDOWN_PARAM = "/graph/setup_teardown_params",
  PROCESS_PARAM_URL = "/graph/process_param",
  SUB_PROCESS_PARAM_URL = "/graph/sub_process/param",
  TASK_BREAKPOINT_URL = "/graph/task/breakpoint"
}
// 修改流程参数
export const updateProcessParamRequest = (params: Process.ProcessParamType, process_id: string) =>
  http.put<BaseData>(API.PROCESS_PARAM_URL, { process_id: process_id, process_params: params });

// 获取子流程参数
export const getSubProcess = (process_id: string) =>
  http.get<FlowOperator.SubprocessParmaType[]>(`${API.SUB_PROCESS_PARAM_URL}?process_id=${process_id}`);

// 修改子流程参数
export const updateSubProcess = (sub_process: FlowOperator.SubprocessParmaType) =>
  http.post<BaseData>(API.SUB_PROCESS_PARAM_URL, sub_process);

// 设置任务断点
export const taskBreakpointRequest = (task_id: string, breakpoint: number) =>
  http.put<BaseData>(`${API.TASK_BREAKPOINT_URL}`, { task_id, breakpoint });

// 创建流程版本
export const createProcessVersionRequest = (data: FlowOperator.ProcessVersionType) =>
  http.post<FlowOperator.CreateProcessVersion>(API.PROCESS_VERSION, data, { loading: true });

// 获取流程版本
export const getProcessVersionByIDRequest = (process_id: string) =>
  http.get<FlowOperator.ProcessVersionType[]>(`${API.PROCESS_VERSION}?process_id=${process_id}`);

// 根据流程名称获取流程版本
export const getProcessVersionByNameRequest = (process_name: string) =>
  http.get<FlowOperator.ProcessVersionType[]>(`${API.PROCESS_VERSION}?process_name=${process_name}`);

// 获取setup/teardown参数
export const getSetupTearDownParamRequest = (name: string) =>
  http.get<FlowOperator.ProcessVersionType[]>(`${API.SETUP_TEARDOWN_PARAM}?name=${name}`);
