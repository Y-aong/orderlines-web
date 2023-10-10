import http from "@/api";

//项目用户相关的请求地址
enum API {
  GROUP_URL = "/group"
}

export const getGroupRequest = (data: any) =>
  http.get(`${API.GROUP_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createGroupRequest = (data: any) => http.post(API.GROUP_URL, data);

export const updateGroupRequest = (data: any) => http.put(API.GROUP_URL, data);

export const deleteGroupRequest = (data: any) => http.delete(API.GROUP_URL, { params: data });
