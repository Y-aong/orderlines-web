export namespace OrderlinesOperator {
  export interface startResponse {
    process_instance_id: string;
  }
  export interface StopResponse {
    task_instance_ids: string[];
  }
}
