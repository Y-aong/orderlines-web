import http from "@/api";

//项目用户相关的请求地址
enum API {
  PROCESS_INSTANCE_URL = "/process_instance",
  PROCESS_OPTION_URL = "/process_option"
}

export const getProcessOptionRequest = () => http.get(`${API.PROCESS_OPTION_URL}`);
export const getProcessInstanceRequest = (data: any) => http.get(API.PROCESS_INSTANCE_URL, data);
export const createProcessInstanceRequest = (data: any) => http.post(API.PROCESS_INSTANCE_URL, data);
export const updateProcessInstanceRequest = (data: any) => http.put(API.PROCESS_INSTANCE_URL, data);
export const deleteProcessInstanceRequest = (data: any) => http.delete(`${API.PROCESS_INSTANCE_URL}?id=${data.id}`);
