import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { useStoreData } from './shared/utils/login';
import AppHome from '@/pages/AppHome.vue';
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: AppHome,
  },
  {
    path: '/control',
    name: 'control',
    component: import('@/pages/AppControl.vue'),
    children: [
      { path: '', redirect: '/control/general-view' },
      {
        path: 'general-view',
        component: import('@/pages/general/GeneralView.vue'),
      },
      {
        path: 'build-image',
        component: import('@/components/RouterTemplate.vue'),
        children: [
          { path: '', redirect: '/control/build-image/build-job' },
          {
            path: 'build-job',
            component: import('@/pages/build-job/BuildImage.vue'),
          },
          {
            path: 'build-job/:id',
            component: import('@/pages/build-job/BuildImage.vue'),
          },
          {
            path: 'build-log/:id',
            component: import('@/pages/build-job/BuildLog.vue'),
          },
        ],
      },
      {
        path: 'job-list',
        component: import('@/pages/job-list/JobList.vue'),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫，可在此处进行页面权限处理
router.beforeEach((to, from, next) => {
  const { selectAsideItem } = useStoreData();
  selectAsideItem.value = '';
  if (to.matched.length) {
    // 侧边栏aside选中值与路由保持一致
    const pathArr = to.path?.split('/') || [];
    if (pathArr[1] === 'control') {
      selectAsideItem.value = `/${pathArr[1]}/${pathArr[2]}` || '';
    }
    next();
  } else {
    next('/home');
  }
});
