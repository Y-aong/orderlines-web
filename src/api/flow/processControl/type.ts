export namespace ProcessControl {
  export interface PreNodeResult {
    code: number;
    success: boolean;
    data: Data;
    message: string;
  }

  interface Data {
    result_config_options: any[];
    pre_task_config: PreTaskConfig[];
  }

  interface PreTaskConfig {
    label: string;
    value: string;
  }
}
