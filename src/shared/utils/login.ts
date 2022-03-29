const LOGIN_KEYS = {
  USER_TOKEN: '_U_T_',
  USER_ID: '_U_I_',
};

import { Guard, GuardMode } from '@authing/native-js-ui-components';
import { AnyObj } from '../interface/interface';
import { queryCourse } from '@/api/api';
import { useStoreData } from './common';

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
