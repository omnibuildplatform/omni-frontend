import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { AnyObj, StringObj } from '@/shared/interface/interface';

/**
 * 获取授权的相关回调链接
 */
export function queryCourse() {
  const url = '/courses/course-list.json';

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
export function startBuild(data: AnyObj) {
  const url = '/api/v1/images/startBuild';
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
