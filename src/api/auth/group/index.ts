import http from "@/api";
import { User } from "./type";

//项目用户相关的请求地址
enum API {
  GROUP_URL = "/group",
  GROUP_OWNER_URL = "/option/group_owner"
}

export const getGroupOwner = () => http.get(API.GROUP_OWNER_URL);
export const getGroupRequest = (data: User.ReqUserParams) => http.get(API.GROUP_URL, data);

export const createGroupRequest = (data: User.ResUserList) => http.post(API.GROUP_URL, data);

export const updateGroupRequest = (data: User.ResUserList) => http.put(API.GROUP_URL, data);

export const deleteGroupRequest = (data: any) => http.delete(`${API.GROUP_URL}?id=${data.id}`);
