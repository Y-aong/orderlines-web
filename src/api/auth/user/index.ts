import http from "@/api";

//项目用户相关的请求地址
enum API {
  USER_URL = "/user"
}

export const getUserRequest = (data: any) =>
  http.get(`${API.USER_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createUserRequest = (data: any) => http.post(API.USER_URL, data);

export const updateUserRequest = (data: any) => http.put(API.USER_URL, data);

export const deleteUserRequest = (data: any) => http.delete(API.USER_URL, { params: data });
