import http from "@/api";
import { PrometheusInstance, PrometheusNodeMetrics } from "./type";
import { BaseData } from "@/api/interface";

enum API {
  INSTANCE_URL = "/alarm/prometheus/instance",
  NODE_METRICS_URL = "/alarm/node_metrics",
  NODE_METRICS_NETWORK_URL = "/alarm/node_metrics/network",
  NODE_METRICS_CPU_URL = "/alarm/node_metrics/cpu",
  NODE_METRICS_MEMORY_LINE_URL = "/alarm/node_metrics/memory/line",
  NODE_METRICS_CPU_LINE_URL = "/alarm/node_metrics/cpu/line",
  NODE_METRICS_NETWORK_LINE_URL = "/alarm/node_metrics/network/line",
  NODE_METRICS_DISK_LINE_URL = "/alarm/node_metrics/disk/line",

  NODE_METRICS_SWAP_PIE_URL = "/alarm/node_metrics/pie/swap",
  NODE_METRICS_DISK_PIE_URL = "/alarm/node_metrics/pie/disk",
  NODE_METRICS_MEMORY_PIE_URL = "/alarm/node_metrics/pie/memory",

  NODE_METRICS_CPU_GAUGE_URL = "/alarm/node_metrics/gauge/cpu",
  NODE_METRICS_MEMORY_GAUGE_URL = "/alarm/node_metrics/gauge/memory",
  NODE_METRICS_DISK_GAUGE_URL = "/alarm/node_metrics/gauge/disk"
}

export const getPrometheusInstanceRequest = (data: PrometheusInstance.Filter) =>
  http.get<BaseData>(API.INSTANCE_URL, data);
export const updatePrometheusInstanceRequest = (data: PrometheusInstance.AlarmConfirmItem) =>
  http.put<BaseData>(API.INSTANCE_URL, data);

// 获取指定instance监控数据
export const getPrometheusNodeMetricsRequest = (instance_name?: string, time_window?: string) =>
  http.get<PrometheusNodeMetrics.PrometheusNodeMetrics>(
    `${API.NODE_METRICS_URL}?instance_name=${instance_name}&time_window=${time_window}`
  );
// 获取某段时间内的网络流量变化
export const getPrometheusNodeMetricsNetworkRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.NODE_METRICS_NETWORK_URL, data);
// 获取某段时间内的CPU使用变化
export const getPrometheusNodeMetricsCPURequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.NODE_METRICS_CPU_URL, data);

//获取某段时间内的内存使用变化——折线图
export const getNodeMetricsMemoryLineRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.NODE_METRICS_MEMORY_LINE_URL, data);

//获取某段时间内的cpu使用变化——折线图
export const getNodeMetricsCpuLineRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.NODE_METRICS_CPU_LINE_URL, data);

//获取某段时间内的网络使用变化——折线图
export const getNodeMetricsNetworkLineRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.NODE_METRICS_NETWORK_LINE_URL, data);

//获取某段时间内的磁盘使用变化——折线图
export const getNodeMetricsDiskLineRequest = (data?: PrometheusNodeMetrics.Filter) =>
  http.get<BaseData>(API.NODE_METRICS_DISK_LINE_URL, data);

//获取磁盘使用饼图数据
export const getNodeMetricsPieDiskRequest = () => http.get<BaseData>(API.NODE_METRICS_SWAP_PIE_URL);
//获取swap内存使用饼图数据
export const getNodeMetricsPieSwapRequest = () => http.get<BaseData>(API.NODE_METRICS_DISK_PIE_URL);
//获取内存使用饼图数据
export const getNodeMetricsPieMemoryRequest = () => http.get<BaseData>(API.NODE_METRICS_MEMORY_PIE_URL);

//获取节点中cpu占用——仪表盘
export const getNodeMetricsGaugeCpuRequest = () => http.get<BaseData>(API.NODE_METRICS_CPU_GAUGE_URL);
//获取节点中内存占用——仪表盘
export const getNodeMetricsGaugeMemoryRequest = () => http.get<BaseData>(API.NODE_METRICS_MEMORY_GAUGE_URL);
//获取节点中磁盘占用——仪表盘
export const getNodeMetricsGaugeDiskRequest = () => http.get<BaseData>(API.NODE_METRICS_DISK_GAUGE_URL);
