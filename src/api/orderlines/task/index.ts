import http from "@/api";
import { Task } from "./type";
import { ResultData, BaseUpdate } from "@/api/interface";

enum API {
  TASK_URL = "/orderlines/task",
  TASK_DETAIL_URL = "/orderlines/task/detail",
  TASK_EXPORT_URL = "/orderlines//task/export"
}

//导出任务配置信息
export const taskExport = (data: Task.TaskFilter) => http.download(API.TASK_EXPORT_URL, data);
// 获取任务配置详情
export const getTaskDetailRequest = (task_id: string) => http.get(`${API.TASK_DETAIL_URL}?task_id=${task_id}`);
// 获取任务配置列表
export const getTaskRequest = (data: Task.TaskFilter) => http.get<Task.TaskItem>(API.TASK_URL, data);
// 创建任务配置
export const createTaskRequest = (data: Task.TaskItem) => http.post(API.TASK_URL, data);
// 修改任务配置
export const updateTaskRequest = (data: Task.TaskItem) => http.put<ResultData<BaseUpdate>>(API.TASK_URL, data);
// 删除任务配置
export const deleteTaskRequest = (task_id: string) => http.delete(`${API.TASK_URL}?task_id=${task_id}`);
