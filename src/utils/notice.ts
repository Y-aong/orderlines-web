import { ElMessage } from "element-plus";

export const notice = (msg: string, noticeType = "error") => {
  ElMessage({
    type: noticeType,
    message: msg
  });
};
