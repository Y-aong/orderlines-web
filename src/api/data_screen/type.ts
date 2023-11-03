export interface BaseInfoType {
  alarm_count: number;
  free_space_mb: string;
  process_failure_total: number;
  process_run_total: number;
  process_success_total: number;
  process_total: number;
  safe_run_day: number;
}

export interface PluginStatusType {
  value: number;
  name: string;
  percentage: string;
}

export interface ProcessAlarmType {
  maxValue: number;
  name: string;
  percentage: string;
  value: number;
}
export interface AnnualDataType {
  label: string;
  value: string[];
}

export interface RunningCountData {
  data: AnnualDataType[];
  unit: string[];
  columns: string[];
  colors: string[];
}

export interface RunStatusType {
  value: number;
  name: string;
  percentage: string;
}

export interface TrendDataType {
  date: string[];
  value: number[];
  unit: string[];
}

export interface TriggerType {
  trigger: number;
  schedule: number;
}

export interface Process_info {
  name: string;
  process_instance_id: string;
  progress: number;
  status: string;
}

export interface Running_task {
  end_time: string;
  start_time: string;
  task_error: any;
  task_result: any;
  task_name: string;
  task_status: string;
}

export interface Task_node {
  color: string;
  icon: string;
  start_time: string;
  task_name: string;
}

export interface RunningInfoType {
  process_info: Process_info;
  running_task: Running_task;
  task_nodes: Task_node[];
}
