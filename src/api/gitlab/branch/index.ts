import http from "@/api";
import { GitlabBranch } from "./type";
import { DeleteData } from "@/api/interface";

enum API {
  GITLAB_BRANCH = "/gitlab/branch",
  GITLAB_BRANCH_DETAILS = "/gitlab/branch/details",
  GITLAB_BRANCH_EXPORT = "/gitlab/branch/export"
}
// 导出GitlabProject列表
export const gitlabBranchExport = (data: GitlabBranch.GitlabBranchFilter) =>
  http.download(API.GITLAB_BRANCH_EXPORT, data);

// 获取GitlabProject列表
export const getGitlabBranchRequest = (data: GitlabBranch.GitlabBranchFilter) =>
  http.get<GitlabBranch.GitlabBranchItem>(API.GITLAB_BRANCH, data);

// 获取GitlabProject详情
export const getGitlabBranchDetailRequest = (id: number) =>
  http.get<GitlabBranch.GitlabBranchItem>(`${API.GITLAB_BRANCH_DETAILS}?id=${id}`);

// 删除GitlabProject
export const deleteGitlabBranchRequest = (id: number) => http.delete<DeleteData>(`${API.GITLAB_BRANCH}?id=${id}`);
