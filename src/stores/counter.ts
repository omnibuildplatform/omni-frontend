import { AnyObj } from '@/shared/interface/interface';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounter = defineStore('counter', () => {
  // 侧边栏默认选择，根据路由对应切换
  const selectAsideItem = ref('');
  const guardAuthClient = ref({} as AnyObj);

  return { guardAuthClient, selectAsideItem };
});
