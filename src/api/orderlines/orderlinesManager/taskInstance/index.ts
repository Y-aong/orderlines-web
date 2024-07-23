import http from "@/api";
import { TaskInstance } from "./type";
import { DeleteData, BaseData } from "@/api/interface";

enum API {
  TASK_INSTANCE_URL = "/orderlines/task_instance",
  TASK_INSTANCE_DETAIL_URL = "/orderlines/task_instance/detail",
  TASK_INSTANCE_EXPORT = "/orderlines/task_instance/export"
}
// 导出任务实例
export const TaskInstanceExport = (data: TaskInstance.TaskInstanceFilter) =>
  http.download(API.TASK_INSTANCE_EXPORT, data);
// 获取任务实例列表
export const getTaskInstanceRequest = (data: TaskInstance.TaskInstanceFilter) =>
  http.get<TaskInstance.TaskInstanceItem>(API.TASK_INSTANCE_URL, data);
// 获取任务实例详情
export const createTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) =>
  http.post<BaseData>(API.TASK_INSTANCE_URL, data);
// 修改任务实例
export const updateTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) =>
  http.put<BaseData>(API.TASK_INSTANCE_URL, data);
//  删除任务实例
export const deleteTaskInstanceRequest = (id: number) => http.delete<DeleteData>(`${API.TASK_INSTANCE_URL}?id=${id}`);
