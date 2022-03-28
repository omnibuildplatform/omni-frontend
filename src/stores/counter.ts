import { AnyObj } from '@/shared/interface/interface';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounter = defineStore('counter', () => {
  const count = ref(0);
  const increment = () => {
    count.value++;
  };
  const guardAuthClient = ref({} as AnyObj);

  return { guardAuthClient, count, increment };
});
