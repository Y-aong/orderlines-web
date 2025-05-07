import http from "@/api";
import { TaskInstance } from "./type";
import { DeleteData } from "@/api/interface";

enum API {
  TASK_INSTANCE_URL = "/orderlines/task_instance",
  TASK_INSTANCES_URL = "/orderlines/task_instances",
  TASK_INSTANCE_DETAIL_ID_URL = "/orderlines/task_instance/detail",
  TASK_INSTANCE_EXPORT_URL = "/orderlines/task_instance/export",
  TASK_INSTANCE_DETAIL_URL = "/orderlines/task_instance_detail"
}
// 导出任务实例
export const TaskInstanceExport = (data: TaskInstance.TaskInstanceFilter) =>
  http.download(API.TASK_INSTANCE_EXPORT_URL, data);
// 获取任务实例列表
export const getTaskInstanceRequest = (data: TaskInstance.TaskInstanceFilter) =>
  http.get<TaskInstance.TaskInstanceItem>(API.TASK_INSTANCE_URL, data);
//  删除任务实例
export const deleteTaskInstanceRequest = (id: number) => http.delete<DeleteData>(`${API.TASK_INSTANCE_URL}?id=${id}`);
// 获取任务实例根据流程实例id和任务id
export const getTaskInstanceItem = (process_instance_id: string, task_id: string) =>
  http.get<TaskInstance.TaskInstanceItem>(
    `${API.TASK_INSTANCE_DETAIL_URL}?process_instance_id=${process_instance_id}&task_id=${task_id}`
  );
// 获取所有任务实例列表
export const getAllTaskInstanceRequest = (process_id: string, process_instance_id: string) =>
  http.get(API.TASK_INSTANCES_URL, { process_id, process_instance_id });
