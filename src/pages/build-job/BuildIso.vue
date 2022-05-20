<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { buildFromIso, getJobParam } from '@/api/api';
import { AnyObj } from '@/shared/interface/interface';
import BuildLeftTemplate from './build-left-template/BuildLeftTemplate.vue';
import BuildIsoToSelect from './BuildIsoToSelect.vue';

const route = useRoute();
const router = useRouter();
const id = (route.params.id || '') as string;
const name = ref('');
const description = ref('');
const buildDefult = reactive({
  baseImageID: '',
  kickStartId: '',
  kickStartContent: '',
});
if (id) {
  getJobParam(id).then((res) => {
    const { data } = res;
    if (data) {
      name.value = data.JobLabel;
      description.value = data.JobDesc;
      buildDefult.baseImageID = data.BaseImageID;
      buildDefult.kickStartId = data.KickStartID;
      buildDefult.kickStartContent = data.KickStartContent;
    }
  });
}
const buildjob = ref<null | AnyObj>(null);
const build = () => {
  const data = buildjob?.value?.build();
  data.label = name.value;
  data.desc = description.value;
  buildFromIso(data).then((res) => {
    if (res?.data?.JobName) {
      // 构建成功跳转详情
      router.push(`/control/build-iso/build-log/${res.data.JobName}`);
    }
  });
};
</script>
<template>
  <div class="build">
    <BuildLeftTemplate v-model:name="name" v-model:description="description" @build="build"></BuildLeftTemplate>
    <div class="build-right">
      <BuildIsoToSelect ref="buildjob" :build-defult="buildDefult"></BuildIsoToSelect>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.build {
  display: grid;
  grid-template-columns: 360px auto;
}
</style>
