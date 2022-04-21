import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { AnyObj, StringObj } from '@/shared/interface/interface';

/**
 * 获取授权的相关回调链接
 */
export function queryCourse(id: string) {
  const url = `/api/v1/auth/getDetail/${id}`;

  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

/**
 * 获取产品数据
 */
export function queryProductData() {
  const url = '/api/v1/images/param/getBaseData/';

  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 创建
export function createJob(data: AnyObj) {
  const url = '/api/v2/images/createJob';
  return request.post(url, data, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取返回结果
export function getBuildResult(data: string, id: string) {
  const url = `/api/v1/images/queryJobStatus/${data}?id=${id}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取返回结果
export function getCustomePkgList(data: StringObj) {
  const { arch, release, sig } = data;
  const url = `/api/v1/images/param/getCustomePkgList/?arch=${arch}&release=${release}&sig=${sig}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取返回任务列表
export function getHistoryResult() {
  const url = `/api/v2/images/getMySummary`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取返回任务列表
export function getHistoryList(data: AnyObj) {
  const { offset = 0, limit = 10 } = data;
  const url = `/api/v1/images/queryHistory/mine?offset=${offset}&limit=${limit}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取单个任务详情
export function getJobDetail(id: string) {
  const url = `/api/v2/images/getOne/${id}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取单个任务下发参数
export function getJobParam(id: string) {
  const url = `/api/v2/images/getJobParam/${id}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 获取单个任务每一步详情
export function getJobStepDetail(data: StringObj) {
  const { id, stepID, uuid } = data;
  const _uuid = uuid ? `&uuid=${uuid}` : '';
  const url = `/api/v2/images/getLogsOf/${id}?stepID=${stepID}${_uuid}`;
  return request.get(url, { global: true }).then((res: AxiosResponse) => res.data);
}

// 删除任务
export function deleteJob(ids: string[]) {
  const url = '/api/v2/images/deleteJob';
  return request.post(url, ids, { global: true }).then((res: AxiosResponse) => res.data);
}

// 停止任务
export function stopJob(id: string) {
  const url = `/api/v2/images/stopJob/${id}`;
  return request.delete(url, { global: true }).then((res: AxiosResponse) => res.data);
}
