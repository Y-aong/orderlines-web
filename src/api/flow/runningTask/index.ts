import http from "@/api";
import { TaskInstance } from "@/api/orderlines/orderlinesManager/taskInstance/type";

enum API {
  TASK_INSTANCE_DETAIL = "/flow/task_instance_detail"
}

// 获取任务实例根据流程实例id和任务id
export const getTaskInstanceItem = (process_instance_id: string, task_id: string) =>
  http.get<TaskInstance.TaskInstanceItem>(
    `${API.TASK_INSTANCE_DETAIL}?process_instance_id=${process_instance_id}&task_id=${task_id}`
  );
