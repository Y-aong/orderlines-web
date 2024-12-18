import http from "@/api";
import { JenkinsInstance } from "./type";
import { DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  JENKINS_INSTANCE_DETAILS = "/jenkins/instance/details",
  JENKINS_INSTANCE = "/jenkins/instance",
  JENKINS_INSTANCE_EXPORT = "/jenkins/instance/export"
}
// 导出jenkins实例列表
export const jenkinsInstanceExport = (data: JenkinsInstance.JenkinsInstanceFilter) =>
  http.download(API.JENKINS_INSTANCE_EXPORT, data);

// 获取jenkins实例详情
export const getJenkinsInstanceDetailRequest = (id: number) =>
  http.get<JenkinsInstance.JenkinsInstanceItem>(`${API.JENKINS_INSTANCE_DETAILS}?id=${id}`);

// 获取jenkins实例列表
export const getJenkinsInstanceRequest = (data: JenkinsInstance.JenkinsInstanceFilter) =>
  http.get<JenkinsInstance.JenkinsInstanceItem>(API.JENKINS_INSTANCE, data);

// 删除jenkins实例
export const deleteJenkinsInstanceRequest = (id: number) => http.delete<DeleteData>(`${API.JENKINS_INSTANCE}?id=${id}`);
