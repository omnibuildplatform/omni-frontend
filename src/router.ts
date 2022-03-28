import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Summary from '@/pages/Summary.vue';
import Login from '@/components/Login.vue';
import { getUserAuth } from './shared/utils/login';
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/build-job',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/build-job',
    name: 'build-job',
    component: Summary,
    meta: {
      requireAuth: true, // 判断是否需要登录
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫，可在此处进行页面权限处理
router.beforeEach((to, from, next) => {
  const user = getUserAuth();
  if (to.name) {
    if (user.userId && user.token) {
      if (to.name === 'login') {
        next({
          path: '/',
        });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.meta.requireAuth)) {
      next({
        path: '/login',
      });
    } else {
      next();
    }
  } else {
    // 404界面未做
    next();
  }
});
