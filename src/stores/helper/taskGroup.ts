import { TaskGroupItem } from "../interface";

export const getTaskGroupList = (taskGroup: TaskGroupItem[]) => {
  console.log("taskGroup store", taskGroup);
  return taskGroup;
};
