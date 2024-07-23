export namespace DataScreen {
  export interface PluginUseType {
    name: string;
    value: number;
    percentage: string;
  }
  export interface ProcessAlarmType {
    name?: string;
    value?: string;
    percentage?: string;
    maxValue?: string;
  }
  export interface ProcessStatusType {
    name: string;
    value: string;
    percentage: string;
  }

  interface Color {
    color_item: string[];
  }

  interface Column {
    column_item: string[];
  }

  interface Unit {
    unit_item: string[];
  }

  interface Datum {
    label: string;
    value: string;
  }

  export interface RunningCountType {
    data: Datum[];
    unit: Unit[];
    columns: Column[];
    colors: Color[];
  }

  export interface RunTrendType {
    date: string[];
    value: string[];
    unit: string[];
  }

  export interface BaseInfoType {
    process_total: string;
    process_success_total: string;
    process_failure_total: string;
    process_run_total: string;
    alarm_count: string;
    free_space_mb: string;
    safe_run_day: string;
  }

  export interface TriggerType {
    schedule: number;
    trigger: number;
  }

  export interface RunningInfoType {
    process_info: ProcessInfo;
    running_task: RunningTask;
    task_nodes: TaskNode[];
  }

  interface TaskNode {
    color: string;
    icon: string;
    start_time: string;
    task_name: string;
  }

  interface RunningTask {
    end_time: string;
    start_time: string;
    task_error: TaskError;
    task_name: string;
    task_result: TaskResult;
    task_status: string;
  }

  interface TaskResult {
    status: string;
  }

  interface TaskError {}

  interface ProcessInfo {
    name: string;
    process_instance_id: string;
    progress: number;
    status: string;
  }
}
