import http from "@/api";
import { GitlabProject } from "./type";
import { DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  GITLAB_PROJECT = "/gitlab/project",
  GITLAB_PROJECT_DETAILS = "/gitlab/project/details",
  GITLAB_PROJECT_EXPORT = "/gitlab/project/export"
}
// 导出GitlabProject列表
export const gitlabProjectExport = (data: GitlabProject.GitlabProjectFilter) =>
  http.download(API.GITLAB_PROJECT_EXPORT, data);

// 获取GitlabProject列表
export const getGitlabProjectRequest = (data: GitlabProject.GitlabProjectFilter) =>
  http.get<GitlabProject.GitlabProjectItem>(API.GITLAB_PROJECT, data);

// 获取GitlabProject详情
export const getGitlabProjectDetailRequest = (id: number) =>
  http.get<GitlabProject.GitlabProjectItem>(`${API.GITLAB_PROJECT_DETAILS}?id=${id}`);

// 删除GitlabProject
export const deleteGitlabProjectRequest = (id: number) => http.delete<DeleteData>(`${API.GITLAB_PROJECT}?id=${id}`);
