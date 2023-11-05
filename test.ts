[
  {
    active: 1,
    creator: null,
    creator_id: null,
    desc: "this is a test",
    id: 1,
    insert_time: "2023-11-04 15:23:22",
    invalid_end_time: null,
    invalid_start_time: null,
    process_config: null,
    process_id: "d21239865c674996823538275ae4dc24",
    process_name: "测试流程001",
    process_params: null,
    schedule_plan: {
      active: 1,
      id: 1,
      job_id: "d21239865c674996823538275ae4dc24",
      run_date: "2023-08-08 12:00:00",
      timezone: "Asia/Shanghai"
    },
    schedule_plan_id: 1,
    schedule_task_name: "测试定时任务",
    trigger: "date",
    update_time: "2023-11-04 15:23:22",
    updater: null,
    updater_id: null
  }
];
export interface Schedule_plan {
  active: number;
  id: number;
  job_id: string;
  run_date: string;
  timezone: string;
}

export interface RootObject {
  active: number;
  creator?: any;
  creator_id?: any;
  desc: string;
  id: number;
  insert_time: string;
  invalid_end_time?: any;
  invalid_start_time?: any;
  process_config?: any;
  process_id: string;
  process_name: string;
  process_params?: any;
  schedule_plan: Schedule_plan;
  schedule_plan_id: number;
  schedule_task_name: string;
  trigger: string;
  update_time: string;
  updater?: any;
  updater_id?: any;
}
