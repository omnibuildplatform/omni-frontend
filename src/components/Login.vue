<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Guard } from '@authing/vue-ui-components';

// 引入 CSS 文件
import '@authing/vue-ui-components/lib/index.min.css';
import { AnyObj } from '@/shared/interface/interface';
import { queryCourse } from '@/api/api';
import { saveUserAuth } from '@/shared/utils/login';
import { useStoreData } from '@/shared/utils/common';

const { guardAuthClient } = useStoreData();
defineProps({
  appId: {
    type: String,
    default: '623d6bf75c72636ebb8c5e4b',
  },
});

const onLogin = (user: AnyObj) => {
  queryCourse(user.id).then((res) => {
    const { data } = res;
    guardAuthClient.value = data;
    saveUserAuth(data.id, data.token);
    jump();
  });
};

const router = useRouter();
const jump = () => {
  router.push('/build-job');
};
</script>
<template>
  <div class="login">
    <Guard :app-id="appId" @login="onLogin" />
  </div>
</template>
<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
}
</style>
