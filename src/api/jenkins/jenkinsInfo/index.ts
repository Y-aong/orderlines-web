import http from "@/api";
import { Jenkins } from "./type";
import { DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  JENKINS_INFO = "/jenkins/info",
  JENKINS_DETAILS = "/jenkins/details"
}
// 导出jenkins列表
export const jenkinsExport = (data: Jenkins.JenkinsInfoFilter) => http.download(API.JENKINS_INFO, data);

// 获取jenkins列表
export const getJenkinsRequest = (data: Jenkins.JenkinsInfoFilter) =>
  http.get<Jenkins.JenkinsInfoItem>(API.JENKINS_INFO, data);

// 获取jenkins详情
export const getJenkinsDetailRequest = (id: number) =>
  http.get<Jenkins.JenkinsInfoItem>(`${API.JENKINS_DETAILS}?id=${id}`);

// 删除jenkins
export const deleteJenkinsRequest = (id: number) => http.delete<DeleteData>(`${API.JENKINS_INFO}?id=${id}`);
