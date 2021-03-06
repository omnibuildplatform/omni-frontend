import 'virtual:svg-icons-register';
import '@/shared/styles/base.scss';
import '@/shared/styles/common.scss';
import '@/shared/styles/reset-scroll.scss';
import '@authing/native-js-ui-components/lib/index.min.css';
import '@/shared/utils/ele-reset.ts';
import '@wangeditor/editor/dist/css/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import SvgIcon from '@/components/SvgIcon.vue';

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.component('SvgIcon', SvgIcon);

app.mount('#app');
