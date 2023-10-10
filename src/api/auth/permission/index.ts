import http from "@/api";

//项目用户相关的请求地址
enum API {
  PERMISSION_URL = "/permission"
}

export const getPermissionRequest = (data: any) =>
  http.get(`${API.PERMISSION_URL}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`);

export const createPermissionRequest = (data: any) => http.post(API.PERMISSION_URL, data);

export const updatePermissionRequest = (data: any) => http.put(API.PERMISSION_URL, data);

export const deletePermissionRequest = (data: any) => http.delete(API.PERMISSION_URL, { params: data });
