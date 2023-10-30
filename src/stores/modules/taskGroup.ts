import { defineStore } from "pinia";
import { TaskGroupStore } from "../interface";
import { getTaskGroupList } from "../helper/taskGroup";

const useTaskGroupStore = defineStore({
  id: "taskGroup",
  state: (): TaskGroupStore => ({
    //任务组列表
    taskGroup: []
  }),
  getters: {
    taskGroupGet: state => getTaskGroupList(state.taskGroup)
  },
  actions: {}
});
export default useTaskGroupStore;
