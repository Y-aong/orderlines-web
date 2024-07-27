import { defineStore } from "pinia";

import { getStorage } from "@/utils/storage";

interface runningTask {
  task_name: string;
  method_kwargs: any;
  task_config: any;
  task_status: string;
  start_time: string;
  end_time: string;
  task_result: any;
  task_error_info: any;
}

interface RunningInfo {
  runningTask: runningTask[];
  taskProgress: number;
  clickCheckTask: runningTask;
  running_edge: string[];
  graph_data: any;
}

const useRunningTaskStore = defineStore("runningTask", {
  state: (): RunningInfo => ({
    runningTask: getStorage("runningTask", "object") || [],
    taskProgress: 0,
    clickCheckTask: {
      task_name: "",
      method_kwargs: {},
      task_config: [],
      task_status: "",
      start_time: "",
      end_time: "",
      task_result: {},
      task_error_info: {}
    },
    running_edge: [],
    graph_data: []
  }),
  getters: {
    getRunningTask(state) {
      return state.runningTask;
    }
  },
  actions: {
    setRunningTask(runningTask: runningTask[]) {
      this.runningTask = runningTask;
    }
  }
});
export default useRunningTaskStore;
