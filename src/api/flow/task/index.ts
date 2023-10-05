import http from "@/api";
import { TaskNodeType } from "@/api/flow/type";

//项目用户相关的请求地址
enum API {
  TASK = "/task"
}

// 任务节点
export const createTaskRequest = (taskNode: TaskNodeType) => http.post(API.TASK, taskNode);

export const updateTaskRequest = (taskNode: TaskNodeType) => http.put(API.TASK, taskNode);

export const getTaskRequest = (task_id: number) => http.get(`${API.TASK}?task_id=${task_id}`);

export const deleteTaskRequest = (task_id: number) => http.delete(`${API.TASK}?task_id=${task_id}`);
