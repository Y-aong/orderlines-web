import http from "@/api";
import { Task } from "./type";
import { ResultData, BaseUpdate } from "@/api/interface";

enum API {
  TASK_URL = "/task",
  TASK_EXPORT_URL = "/export/task"
}

export const taskExport = (data: Task.TaskFilter) => http.download(API.TASK_EXPORT_URL, data);

export const getSingleTaskRequest = (task_id: string) => http.get(`${API.TASK_URL}?task_id=${task_id}`);
export const getTaskRequest = (data: Task.TaskFilter) => http.get<Task.TaskItem>(API.TASK_URL, data);

export const createTaskRequest = (data: Task.TaskItem) => http.post(API.TASK_URL, data);

export const updateTaskRequest = (data: Task.TaskItem) => http.put<ResultData<BaseUpdate>>(API.TASK_URL, data);

export const deleteTaskRequest = (task_id: string) => http.delete(`${API.TASK_URL}?task_id=${task_id}`);
