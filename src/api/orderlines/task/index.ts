import http from "@/api";

enum API {
  TASK_URL = "/task",
  TASK_EXPORT_URL = "/export/task"
}

export const taskExport = (data: any) => http.download(API.TASK_EXPORT_URL, data);

export const getTaskRequest = (data: any) => http.get(API.TASK_URL, data);

export const createTaskRequest = (data: any) => http.post(API.TASK_URL, data);

export const updateTaskRequest = (data: any) => http.put(API.TASK_URL, data);

export const deleteTaskRequest = (data: any) => http.delete(`${API.TASK_URL}?id=${data.id}`);
