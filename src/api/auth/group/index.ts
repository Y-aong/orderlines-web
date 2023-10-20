import http from "@/api";
import { Group } from "./type";

//项目用户相关的请求地址
enum API {
  GROUP_URL = "/group",
  GROUP_OWNER_URL = "/option/group_owner"
}

export const getGroupOwner = () => http.get(API.GROUP_OWNER_URL);
export const getGroupRequest = (data: Group.GroupFilter) => http.get<Group.GroupItem>(API.GROUP_URL, data);
export const createGroupRequest = (data: Group.GroupItem) => http.post(API.GROUP_URL, data);
export const updateGroupRequest = (data: Group.GroupItem) => http.put(API.GROUP_URL, data);
export const deleteGroupRequest = (data: Group.GroupItem) => http.delete(`${API.GROUP_URL}?id=${data.id}`);
