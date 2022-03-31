import { Guard, GuardMode } from '@authing/native-js-ui-components';
import { AnyObj } from '../interface/interface';
import { queryCourse } from '@/api/api';
import { useCounter } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const LOGIN_KEYS = {
  USER_TOKEN: '_U_T_',
  USER_ID: '_U_I_',
};

// 存储用户id及token，用于下次登录
export function saveUserAuth(id = '', code = '') {
  if (!id && !code) {
    localStorage.removeItem(LOGIN_KEYS.USER_ID);
    localStorage.removeItem(LOGIN_KEYS.USER_TOKEN);
  } else {
    localStorage.setItem(LOGIN_KEYS.USER_ID, id);
    localStorage.setItem(LOGIN_KEYS.USER_TOKEN, code);
  }
}

// 获取用户id及token
export function getUserAuth() {
  let token = localStorage.getItem(LOGIN_KEYS.USER_TOKEN) || '';
  let userId = localStorage.getItem(LOGIN_KEYS.USER_ID) || '';
  if (token === 'undefined' || userId === 'undefined') {
    token = '';
    userId = '';
    saveUserAuth();
  }
  return {
    userId,
    token,
  };
}

// 登录弹窗
let guard: any;
export function showGuard() {
  if (!guard) {
    initGuard();
  } else {
    guard.show();
  }
  guard.show();
}
export function initGuard() {
  if (!guard) {
    const appId = '623d6bf75c72636ebb8c5e4b';
    guard = new Guard(appId, {
      title: 'OmniBuildPlatform',
      mode: GuardMode.Modal,
      clickCloseable: true,
      escCloseable: true,
      disableRegister: true,
      disableResetPwd: true,
    });
    guard.on('login', (user: AnyObj) => {
      queryCourse(user.id).then((res) => {
        const { data } = res;
        const { guardAuthClient } = useStoreData();
        guardAuthClient.value = data;
        saveUserAuth(data.id, data.token);
        setTimeout(() => {
          guard.hide();
          removeGuard();
          window.location.reload();
        }, 300);
      });
    });
  }
  return guard;
}

export function removeGuard() {
  guard = null;
}

// token失效打开登录
export function tokenFailIndicateLogin() {
  saveUserAuth();
  showGuard();
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
