import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { useStoreData } from './shared/utils/login';
import AppHome from '@/pages/AppHome.vue';
import AppControl from '@/pages/AppControl.vue';
import GeneralView from '@/pages/general/GeneralView.vue';
import BuildImage from '@/pages/build-job/BuildImage.vue';
import BuildLog from '@/pages/build-job/BuildLog.vue';
import BuildIso from '@/pages/build-job/BuildIso.vue';
import BaseImages from '@/pages/configure/BaseImages.vue';
import KickStartFiles from '@/pages/configure/KickStartFiles.vue';
import JobList from '@/pages/job-list/JobList.vue';
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
    component: AppControl,
    children: [
      { path: '', redirect: '/control/general-view' },
      {
        path: 'general-view',
        component: GeneralView,
      },
      {
        path: 'base-images',
        component: BaseImages,
      },
      {
        path: 'kickstart-files',
        component: KickStartFiles,
      },
      {
        path: 'build-job',
        component: BuildImage,
      },
      {
        path: 'build-job/:id',
        component: BuildImage,
      },
      {
        path: 'build-job/build-log/:id',
        component: BuildLog,
      },
      {
        path: 'build-iso',
        component: BuildIso,
      },
      {
        path: 'build-iso/:id',
        component: BuildIso,
      },
      {
        path: 'build-iso/build-log/:id',
        component: BuildLog,
      },
      {
        path: 'job-list',
        component: JobList,
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
