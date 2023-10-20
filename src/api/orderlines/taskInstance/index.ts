import http from "@/api";
import { TaskInstance } from "./type";

enum API {
  TASK_INSTANCE_URL = "/task_instance",
  TASK_INSTANCE_EXPORT = "/export/task_instance"
}

export const TaskInstanceExport = (data: TaskInstance.TaskInstanceFilter) =>
  http.download(API.TASK_INSTANCE_EXPORT, data);
export const getTaskInstanceRequest = (data: TaskInstance.TaskInstanceFilter) =>
  http.get<TaskInstance.TaskInstanceItem>(API.TASK_INSTANCE_URL, data);
export const createTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) =>
  http.post(API.TASK_INSTANCE_URL, data);
export const updateTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) => http.put(API.TASK_INSTANCE_URL, data);
export const deleteTaskInstanceRequest = (data: TaskInstance.TaskInstanceItem) =>
  http.delete(`${API.TASK_INSTANCE_URL}?id=${data.id}`);
