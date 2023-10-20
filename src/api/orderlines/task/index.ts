import http from "@/api";
import { Task } from "./type";

enum API {
  TASK_URL = "/task",
  TASK_EXPORT_URL = "/export/task"
}

export const taskExport = (data: Task.TaskFilter) => http.download(API.TASK_EXPORT_URL, data);

export const getTaskRequest = (data: Task.TaskFilter) => http.get<Task.TaskItem>(API.TASK_URL, data);

export const createTaskRequest = (data: Task.TaskItem) => http.post(API.TASK_URL, data);

export const updateTaskRequest = (data: Task.TaskItem) => http.put(API.TASK_URL, data);

export const deleteTaskRequest = (data: Task.TaskItem) => http.delete(`${API.TASK_URL}?id=${data.id}`);
