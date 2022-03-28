import { useRouter } from 'vue-router';

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

// token失效跳转登录
export function tokenFailIndicateLogin() {
  saveUserAuth();
  const router = useRouter();
  router.push('/login');
}
