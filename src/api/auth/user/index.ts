import http from "@/api";
import { User } from "./type";
import { ResPage, DeleteRes } from "@/api/interface/index";

//项目用户相关的请求地址
enum API {
  USER_URL = "/oauth/user",
  USER_DETAIL_URL = "/oauth/user/detail"
}

export const getUserDetailRequest = (id: string) => http.get<ResPage<User.UserItem>>(`${API.USER_DETAIL_URL}?id=${id}`);
export const getUserRequest = (data: User.UserFilter) => http.get<ResPage<User.UserItem>>(API.USER_URL, data);
export const createUserRequest = (data: User.UserItem) => http.post(API.USER_URL, data);
export const updateUserRequest = (data: User.UserItem) => http.put(API.USER_URL, data);
export const deleteUserRequest = (id: string) => http.delete<DeleteRes>(`${API.USER_URL}?id=${id}`);
