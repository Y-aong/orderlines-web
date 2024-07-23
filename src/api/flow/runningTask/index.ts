import http from "@/api";
import { TaskNodeNS } from "@/api/flow/taskNode/type";

enum API {
  RunningTask = "/flow/running_task",
  TASK_INSTANCE_DETAIL = "/flow/task_instance_detail"
}
// 获取正在运行的节点线
export const getRunningTaskRequest = (RunningTaskFilter: TaskNodeNS.FlowDataFilter) =>
  http.get(API.RunningTask, RunningTaskFilter);

// 获取任务实例根据流程实例id和任务id
export const getTaskInstanceItem = (process_instance_id: string, task_id: string) =>
  http.get(`${API.TASK_INSTANCE_DETAIL}?process_instance_id=${process_instance_id}&task_id=${task_id}`);
