// 公共函数方法

import { queryCourse } from '@/api/api';
import { useCounter } from '@/stores/counter';
import { storeToRefs } from 'pinia';
import { getUserAuth } from './login';

/**
 * 方法pre=next视图不刷新
 * 解决数组直接赋值不刷新视图
 * @param pre 修改前的值
 * @param next 修改后数组
 */
export function commonAssignArray(pre: Array<any>, next: Array<any>) {
  pre.splice(0, pre.length);
  pre.push(...next);
}

/**
 * @callback store 将store返回，使用解构赋值接受
 */
export function useStoreData() {
  const counter = useCounter();
  const stores = storeToRefs(counter);
  return stores;
}

// 刷新页面后store内参数被清除，需重新设定
export function setStoreData() {
  const { guardAuthClient } = useStoreData();
  const { userId } = getUserAuth();
  if (!guardAuthClient.value.photo && userId) {
    queryCourse(userId).then((res) => {
      const { data } = res;
      guardAuthClient.value = data;
    });
  }
}
