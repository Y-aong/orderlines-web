import http from "@/api";

enum API {
  TASK_INSTANCE_URL = "/task_instance",
  TASK_INSTANCE_EXPORT = "/export/task_instance"
}

export const TaskInstanceExport = (data: any) => http.download(API.TASK_INSTANCE_EXPORT, data);
export const getTaskInstanceRequest = (data: any) => http.get(API.TASK_INSTANCE_URL, data);
export const createTaskInstanceRequest = (data: any) => http.post(API.TASK_INSTANCE_URL, data);
export const updateTaskInstanceRequest = (data: any) => http.put(API.TASK_INSTANCE_URL, data);
export const deleteTaskInstanceRequest = (data: any) => http.delete(`${API.TASK_INSTANCE_URL}?id=${data.id}`);
