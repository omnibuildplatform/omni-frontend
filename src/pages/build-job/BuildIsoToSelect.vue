<script setup lang="ts">
import { getImagesAndKickStart, getKickStart } from '@/api/api';
import { AnyObj, StringObj } from '@/shared/interface/interface';
import { ref, toRefs, watch } from 'vue';
import ProductSelect from './product-select/ProductSelect.vue';

const props = defineProps({
  buildDefult: {
    type: Object,
    default: () => ({
      baseImageID: '',
      kickStartId: '',
      kickStartContent: '',
    }),
  },
});
const { buildDefult } = toRefs(props);
const editor = ref<null | AnyObj>(null);
const imagesArr = ref([]);
const image = ref('');
const kickStartArr = ref([]);
const kickStart = ref('');
watch(
  () => buildDefult.value,
  () => {
    image.value = buildDefult.value.baseImageID;
    kickStart.value = buildDefult.value.kickStartId;
    editData.value = buildDefult.value.kickStartContent;
  },
  { deep: true }
);
const editData = ref('');
getImagesAndKickStart().then((data) => {
  if (data?.data) {
    const { images = [], kickstart = [] } = data.data;
    imagesArr.value = images.map((item: StringObj) => ({
      key: String(item.ID),
      value: String(item.ID),
      label: item.Name,
    }));
    kickStartArr.value = kickstart.map((item: StringObj) => ({
      key: String(item.ID),
      value: String(item.ID),
      label: item.Name,
    }));
  }
});
const chooseImage = (e: string) => {
  image.value = e;
};
const chooseKickStart = (e: string) => {
  kickStart.value = e;
  getKickStart(kickStart.value).then((data) => {
    if (data?.data) {
      editData.value = data.data.Content;
    }
  });
};
const build = () => {
  const res = editor?.value?.save();
  let kickStartName = '';
  kickStartArr.value.forEach((item: StringObj) => {
    if (item.key === kickStart.value) {
      kickStartName = item.label;
    }
  });
  return {
    baseImageID: image.value,
    kickStartContent: res.data || '',
    kickStartName,
    kickStartId: kickStart.value,
  };
};
defineExpose({ build });
</script>
<template>
  <div class="iso">
    <div class="iso-header m-b-24">Image from ISO</div>
    <div class="iso-body common-content-bg-color common-level-two-fz">
      <div class="iso-body-select m-b-40">
        <span class="iso-body-select-title">Choose Images</span>
        <ProductSelect class="margin-right" type="group" width="300px" :options="imagesArr" :value="image" @change-data="chooseImage($event)"></ProductSelect>
        <span class="iso-body-select-title">Choose KickStart Files</span>
        <ProductSelect type="group" width="300px" :options="kickStartArr" :value="kickStart" @change-data="chooseKickStart($event)"></ProductSelect>
      </div>
      <div>
        <p class="m-b-24">Selected KS file</p>
        <EditorComponent :id="kickStart" ref="editor" :data="editData" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.iso {
  padding: 40px;
  &-header {
    height: 32px;
    font-size: 24px;
    line-height: 32px;
    font-weight: bold;
  }
  &-body {
    padding: 40px;
    &-select {
      display: flex;
      align-items: center;
      &-title {
        margin-right: 16px;
      }
    }
  }
}
.margin-right {
  margin-right: 24px;
}
</style>
