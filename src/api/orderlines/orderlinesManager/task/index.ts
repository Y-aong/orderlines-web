import http from "@/api";
import { Task } from "./type";
import { DeleteData, BaseData } from "@/api/interface";
import { TaskTable } from "@/api/graph/graphData/type";

enum API {
  ALL_TASK_URL = "/orderlines/tasks",
  TASK_URL = "/orderlines/task",
  TASK_DETAIL_URL = "/orderlines/task/detail",
  TASK_EXPORT_URL = "/orderlines/task/export",
  TASK_GROUP_URL = "/orderlines/task_group",
  TASK_BREAKPOINT_URL = "/orderlines/task/breakpoint"
}

// 设置任务断点
export const taskBreakpointRequest = (task_id: string, breakpoint: number) =>
  http.put<BaseData>(`${API.TASK_BREAKPOINT_URL}`, { task_id, breakpoint });
//导出任务配置信息
export const taskExport = (data: Task.TaskFilter) => http.download(API.TASK_EXPORT_URL, data);
// 获取任务配置详情
export const getTaskDetailRequest = (task_id: string) => http.get(`${API.TASK_DETAIL_URL}?task_id=${task_id}`);
// 获取任务配置列表
export const getTaskRequest = (data: Task.TaskFilter) => http.get<Task.TaskItem>(API.TASK_URL, data);
// 获取所有任务配置列表
export const getTasksRequest = (process_id: string) => http.get<TaskTable.TaskType[]>(API.ALL_TASK_URL, { process_id });
// 批量修改任务配置
export const updateTasksRequest = (tasks: TaskTable.TaskType[]) => http.put(API.ALL_TASK_URL, { tasks });
// 创建任务配置
export const createTaskRequest = (data: Task.TaskItem) => http.post<BaseData>(API.TASK_URL, data);
// 修改任务配置
export const updateTaskRequest = (data: Task.TaskItem) => http.put<BaseData>(API.TASK_URL, data);
// 修改任务组参数
export const updateGroupTaskRequest = (data: Task.TaskGroup) => http.put<BaseData>(API.TASK_GROUP_URL, data);
// 删除任务配置
export const deleteTaskRequest = (task_id: string) => http.delete<DeleteData>(`${API.TASK_URL}?task_id=${task_id}`);
