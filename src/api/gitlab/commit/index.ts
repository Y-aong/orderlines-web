import http from "@/api";
import { GitlabCommit } from "./type";
import { DeleteData } from "@/api/interface";

enum API {
  GITLAB_COMMIT = "/gitlab/commit",
  GITLAB_COMMIT_DETAILS = "/gitlab/commit/details",
  GITLAB_COMMIT_EXPORT = "/gitlab/commit/export"
}
// 导出GitlabProject列表
export const gitlabCommitExport = (data: GitlabCommit.GitlabCommitFilter) =>
  http.download(API.GITLAB_COMMIT_EXPORT, data);

// 获取GitlabProject列表
export const getGitlabCommitRequest = (data: GitlabCommit.GitlabCommitFilter) =>
  http.get<GitlabCommit.GitlabCommitItem>(API.GITLAB_COMMIT, data);

// 获取GitlabProject详情
export const getGitlabCommitDetailRequest = (id: number) =>
  http.get<GitlabCommit.GitlabCommitItem>(`${API.GITLAB_COMMIT_DETAILS}?id=${id}`);

// 删除GitlabProject
export const deleteGitlabCommitRequest = (id: number) => http.delete<DeleteData>(`${API.GITLAB_COMMIT}?id=${id}`);
