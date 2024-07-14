import http from "@/api";
import { Permission } from "./type";

//项目用户相关的请求地址
enum API {
  PERMISSION_URL = "/oauth/permission",
  PERMISSION_DETAIL_URL = "/oauth/permission/detail"
}

export const getPermissionDetailRequest = (id: string) =>
  http.get<Permission.PermissionItem>(`${API.PERMISSION_DETAIL_URL}?id=${id}`);

export const getPermissionRequest = (data: Permission.PermissionFilter) =>
  http.get<Permission.PermissionItem>(API.PERMISSION_URL, data);

export const createPermissionRequest = (data: Permission.PermissionItem) => http.post(API.PERMISSION_URL, data);

export const updatePermissionRequest = (data: Permission.PermissionItem) => http.put(API.PERMISSION_URL, data);

export const deletePermissionRequest = (id: string) => http.delete(`${API.PERMISSION_URL}?id=${id}`);
