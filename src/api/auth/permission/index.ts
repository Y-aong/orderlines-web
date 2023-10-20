import http from "@/api";
import { Permission } from "./type";

//项目用户相关的请求地址
enum API {
  PERMISSION_URL = "/permission"
}

export const getPermissionRequest = (data: Permission.PermissionFilter) =>
  http.get<Permission.PermissionItem>(API.PERMISSION_URL, data);

export const createPermissionRequest = (data: Permission.PermissionItem) => http.post(API.PERMISSION_URL, data);

export const updatePermissionRequest = (data: Permission.PermissionItem) => http.put(API.PERMISSION_URL, data);

export const deletePermissionRequest = (data: Permission.PermissionItem) =>
  http.delete(`${API.PERMISSION_URL}?id=${data.id}`);
