<script setup lang="ts">
import { reactive, ref } from 'vue';
import BuildJob from './BuildJob.vue';
import { useRoute, useRouter } from 'vue-router';
import { createJob, getJobParam } from '@/api/api';
import { AnyObj } from '@/shared/interface/interface';

const route = useRoute();
const router = useRouter();
const id = (route.params.id || '') as string;
const name = ref('');
const description = ref('');
const buildDefult = reactive({
  arch: '',
  release: '',
  buildType: '',
  customPkg: [],
});
if (id) {
  getJobParam(id).then((res) => {
    const { data } = res;
    if (data) {
      name.value = data.JobLabel;
      description.value = data.JobDesc;
      buildDefult.arch = data.Arch;
      buildDefult.release = data.Release;
      buildDefult.buildType = data.BuildType;
      buildDefult.customPkg = (data.CustomPkg && data.CustomPkg.split(',')) || [];
    }
  });
}
const buildjob = ref<null | AnyObj>(null);
const build = () => {
  const data = buildjob?.value?.build();
  data.label = name.value;
  data.desc = description.value;
  createJob(data).then((res) => {
    if (res?.data?.JobName) {
      // 构建成功跳转详情
      router.push(`/control/build-job/build-log/${res.data.JobName}`);
    }
  });
};
</script>
<template>
  <div class="build">
    <div class="build-left">
      <div class="build-left-title">Name</div>
      <el-input v-model="name" maxlength="64" placeholder="Please input" />
      <div class="m-t-40 build-left-title">Description</div>
      <el-input v-model="description" :rows="6" type="textarea" maxlength="512" resize="none" placeholder="Please input" show-word-limit />
      <div class="build-left-btngroup">
        <el-button class="btn" type="primary" @click="build">Build</el-button>
        <el-button class="btn" disabled type="primary">Stop</el-button>
        <el-button class="btn" disabled type="primary">Download</el-button>
      </div>
    </div>
    <div class="build-right">
      <BuildJob ref="buildjob" :default-value="buildDefult"></BuildJob>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/handle.scss';
.build {
  display: grid;
  grid-template-columns: 360px auto;
  &-left {
    padding: 40px 24px;
    @include background_color('bg-color2');
    &-title {
      font-size: 20px;
      margin-bottom: 16px;
      line-height: 28px;
    }
    &-btngroup {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      .btn {
        width: 100px;
      }
    }
  }
}
</style>
