import { defineStore } from "pinia";
import { getStorage, setStorage } from "@/utils/storage";

interface GraphStatueType {
  isRunning: boolean;
  isSave: boolean;
  isEdit: boolean;
  isDebug: boolean;
  isStop: boolean;
  isPause: boolean;
  isContinue: boolean;
  isComplete: boolean;
  isDebugContinue: boolean;
  isDebugStop: boolean;
}

const useGraphStatueStore = defineStore("graphStatue", {
  state: (): GraphStatueType => {
    return {
      // 是否运行
      isRunning: getStorage("isRunning", "bool") as boolean,
      // 是否保存
      isSave: getStorage("isSave", "bool") as boolean,
      // 是否编辑
      isEdit: getStorage("isEdit", "bool") as boolean,
      // 是否调试
      isDebug: getStorage("isDebug", "bool") as boolean,
      // 是否停止
      isStop: getStorage("isStop", "bool") as boolean,
      // 是否暂停
      isPause: getStorage("isPause", "bool") as boolean,
      // 是否继续
      isContinue: getStorage("isContinue", "bool") as boolean,
      // 是否完成
      isComplete: getStorage("isComplete", "bool") as boolean,
      // debug继续
      isDebugContinue: getStorage("isDebugContinue", "bool") as boolean,
      // debug停止
      isDebugStop: getStorage("isDebugStop", "bool") as boolean
    };
  },
  actions: {
    // 初始化状态
    process_init_action() {
      this.isRunning = false;
      setStorage("false", "isRunning");
      this.isSave = false;
      setStorage("false", "isSave");
      this.isEdit = true;
      setStorage("true", "isEdit");
      this.isDebug = false;
      setStorage("false", "isDebug");
      this.isStop = false;
      setStorage("false", "isStop");
      this.isPause = false;
      setStorage("false", "isPause");
      this.isContinue = false;
      setStorage("false", "isContinue");
      this.isComplete = false;
      setStorage("false", "isComplete");
      this.isDebugContinue = false;
      setStorage("false", "isDebugContinue");
      this.isDebugStop = false;
      setStorage("false", "isDebugStop");
    },
    // 流程开始运行
    start_process_action() {
      this.isRunning = true;
      setStorage("true", "isRunning");
      this.isStop = false;
      setStorage("false", "isStop");
      this.isPause = false;
      setStorage("false", "isPause");
      this.isContinue = false;
      setStorage("false", "isContinue");
      this.isComplete = false;
      setStorage("false", "isComplete");
    },
    // 流程暂停
    pause_process_action() {
      this.isRunning = true;
      setStorage("true", "isRunning");
      this.isPause = true;
      setStorage("true", "isPause");
    },
    // 流程继续
    continue_process_action() {
      this.isRunning = true;
      setStorage("true", "isRunning");
      this.isPause = false;
      setStorage("false", "isPause");
      this.isContinue = true;
      setStorage("true", "isContinue");
    },
    // 流程停止
    stop_process_action() {
      this.isRunning = true;
      setStorage("true", "isRunning");
      this.isStop = true;
      setStorage("true", "isStop");
      this.isComplete = true;
      setStorage("true", "isComplete");
    },
    // 流程完成
    complete_process_action() {
      this.isRunning = true;
      setStorage("true", "isRunning");
      this.isSave = true;
      setStorage("true", "isSave");
      this.isStop = false;
      setStorage("false", "isStop");
      this.isPause = false;
      setStorage("false", "isPause");
      this.isContinue = false;
      setStorage("false", "isContinue");
      this.isComplete = true;
      setStorage("true", "isComplete");
    },
    // 流程编辑
    edit_process_action() {
      this.isRunning = false;
      setStorage("false", "isRunning");
      this.isSave = false;
      setStorage("false", "isSave");
      this.isEdit = true;
      setStorage("true", "isEdit");
    },
    // 流程保存
    save_process_action() {
      this.isRunning = false;
      setStorage("false", "isRunning");
      this.isSave = true;
      setStorage("true", "isSave");
      this.isEdit = false;
      setStorage("false", "isEdit");
    },
    // 流程调试
    debug_process_action() {
      this.isDebug = true;
      setStorage("true", "isDebug");
    },
    // 调试继续
    debug_continue_process_action() {
      this.isDebug = true;
      setStorage("true", "isDebug");
      this.isDebugContinue = true;
      setStorage("true", "isDebugContinue");
    },
    // 调试停止
    debug_stop_process_action() {
      this.isDebug = true;
      setStorage("true", "isDebug");
      this.isDebugStop = true;
      setStorage("true", "isDebugStop");
    },
    // 修改流程运行模式
    update_process_mode(debug_mode: boolean) {
      this.isDebug = debug_mode;
      const modeStr = debug_mode ? "true" : "false";
      setStorage(modeStr, "isDebug");
    }
  }
});
export default useGraphStatueStore;
