import { defineStore } from "pinia";
import { getStorage } from "@/utils/storage";

export interface LoggerItemType {
  msg: string;
  level: string;
  time: string;
}

interface DebugType {
  debug: boolean;
  currentTaskId: string;
  nextTaskId: string;
  debugMessage: LoggerItemType[];
}

const useDebugStore = defineStore("debug", {
  state: (): DebugType => ({
    debug: false,
    currentTaskId: getStorage("currentTaskId", "string"),
    nextTaskId: getStorage("nextTaskId", "string"),
    debugMessage: []
  })
});

export default useDebugStore;
