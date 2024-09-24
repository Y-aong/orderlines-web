import { defineStore } from "pinia";

interface FlowStatueType {
  isRunning: boolean;
  isRedirect: boolean;
  isSave: boolean;
  isEdit: boolean;
  isDebug: boolean;
  isStop: boolean;
  isPause: boolean;
  isContinue: boolean;
  isComplete: boolean;
}

const useFlowStatueStore = defineStore("flowStatue", {
  state: (): FlowStatueType => ({
    // 是否运行
    isRunning: false,
    // 是否为跳转的链接
    isRedirect: false,
    // 是否保存
    isSave: false,
    // 是否编辑
    isEdit: true,
    // 是否调试
    isDebug: false,
    // 是否停止
    isStop: false,
    // 是否暂停
    isPause: false,
    // 是否继续
    isContinue: false,
    // 是否完成
    isComplete: false
  })
});
export default useFlowStatueStore;
