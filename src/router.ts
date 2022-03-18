import { createRouter, createWebHashHistory } from 'vue-router';
import BuildJob from '@/pages/build-job/BuildJob.vue';
export const routes = [
  {
    path: '/',
    redirect: '/build-job',
  },
  {
    path: '/build-job',
    name: 'build-job',
    component: BuildJob,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫，可在此处进行页面权限处理
// router.beforeEach((to) => {
// if (!isLogined()) {
//   return { name: "home" };
// }
// });
