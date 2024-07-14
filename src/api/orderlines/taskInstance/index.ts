import http from "@/api";
import { TaskInstance } from "./type";

enum API {
  TASK_INSTANCE_URL = "/orderlines/task_instance",
  TASK_INSTANCE_DETAIL_URL = "/orderlines/task_instance/detail",
  TASK_INSTANCE_EXPORT = "/orderlines/export/task_instance"
}
// 导出任务实例
export const TaskInstanceExport = (data: TaskInstance.TaskInstanceFilter) =>
  http.download(API.TASK_INSTANCE_EXPORT, data);
//
export const getTaskInstanceRequest = (data: TaskInstance.TaskInstanceFilter) =>
  http.get<TaskInstance.TaskInstanceItem>(API.TASK_INSTANCE_URL, data);
//
export const createTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) =>
  http.post(API.TASK_INSTANCE_URL, data);
//
export const updateTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) => http.put(API.TASK_INSTANCE_URL, data);
//
export const deleteTaskInstanceRequest = (id: number) => http.delete(`${API.TASK_INSTANCE_URL}?id=${id}`);
