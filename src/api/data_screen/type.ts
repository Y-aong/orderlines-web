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
