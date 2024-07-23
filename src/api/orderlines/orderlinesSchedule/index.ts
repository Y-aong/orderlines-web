import http from "@/api";
import { ScheduleTask } from "./type";
import { DeleteData, BaseData } from "@/api/interface";

enum API {
  SCHEDULE_TASK_URL = "/orderlines/schedule_task",
  SCHEDULE_TASK_EXPORT = "/orderlines/schedule_task/export"
}

export const downloadScheduleTaskRequest = (data: ScheduleTask.ScheduleTaskFilter) =>
  http.download(API.SCHEDULE_TASK_EXPORT, data);

export const getScheduleTaskRequest = (data: ScheduleTask.ScheduleTaskFilter) =>
  http.get<ScheduleTask.ScheduleTaskItem>(API.SCHEDULE_TASK_URL, data);

export const createScheduleTaskRequest = (data: ScheduleTask.ScheduleTaskItem) =>
  http.post<BaseData>(API.SCHEDULE_TASK_URL, data);

export const updateScheduleTaskRequest = (data: ScheduleTask.ScheduleTaskItem) =>
  http.put<BaseData>(API.SCHEDULE_TASK_URL, data);

export const deleteScheduleTaskRequest = (data: ScheduleTask.ScheduleTaskItem) =>
  http.delete<DeleteData>(`${API.SCHEDULE_TASK_URL}?id=${data.id}`);

export const getProcessOptionRequest = (data: ScheduleTask.ScheduleTaskFilter) =>
  http.get<ScheduleTask.ScheduleTaskItem>(API.SCHEDULE_TASK_URL, data);
