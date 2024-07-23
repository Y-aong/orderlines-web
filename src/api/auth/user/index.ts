import http from "@/api";
import { User } from "./type";
import { BaseData, DeleteData } from "@/api/interface";

//项目用户相关的请求地址
enum API {
  USER_URL = "/oauth/user",
  USER_DETAIL_URL = "/oauth/user/detail"
}

export const getUserDetailRequest = (id: string) => http.get<User.UserItem>(`${API.USER_DETAIL_URL}?id=${id}`);
export const getUserRequest = (data: User.UserFilter) => http.get<User.UserItem[]>(API.USER_URL, data);
export const createUserRequest = (data: User.UserItem) => http.post<BaseData>(API.USER_URL, data);
export const updateUserRequest = (data: User.UserItem) => http.put<BaseData>(API.USER_URL, data);
export const deleteUserRequest = (id: string) => http.delete<DeleteData>(`${API.USER_URL}?id=${id}`);
