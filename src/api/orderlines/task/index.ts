import http from "@/api";

enum API {
  TASK_URL = "/task"
}

export const getTaskRequest = (data: any) =>
  http.get(`${API.TASK_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createTaskRequest = (data: any) => http.post(API.TASK_URL, data);

export const updateTaskRequest = (data: any) => http.put(API.TASK_URL, data);

export const deleteTaskRequest = (data: any) => http.delete(API.TASK_URL, { params: data });
