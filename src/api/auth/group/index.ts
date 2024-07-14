import http from "@/api";
import { Group } from "./type";

//项目用户相关的请求地址
enum API {
  GROUP_URL = "/oauth/group",
  GROUP_DETAIL_URL = "/oauth/group/detail"
}

export const getGroupDetailRequest = (id: string) => http.get<Group.GroupItem>(`${API.GROUP_DETAIL_URL}?id=${id}`);
export const getGroupRequest = (data: Group.GroupFilter) => http.get<Group.GroupItem>(API.GROUP_URL, data);
export const createGroupRequest = (data: Group.GroupItem) => http.post(API.GROUP_URL, data);
export const updateGroupRequest = (data: Group.GroupItem) => http.put(API.GROUP_URL, data);
export const deleteGroupRequest = (id: string) => http.delete(`${API.GROUP_URL}?id=${id}`);
