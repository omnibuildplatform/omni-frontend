<script setup lang="ts">
import ProductSelect from '../product-select/ProductSelect.vue';
import ProductFileSelect from '../product-file-select/ProductFileSelect.vue';
import { reactive, ref } from 'vue';
import { AnyObj, CommonOptionsItem, StringObj } from '@/shared/interface/interface';
import { getCustomePkgList } from '@/api/api';
import { commonAssignArray } from '@/shared/methods/common';
import { cloneDeep } from 'lodash';
const props = defineProps({
  group: {
    type: Array as () => Array<string>,
    default: () => [],
    required: true,
  },
  param: {
    type: Object,
    default: () => ({
      arch: '',
      release: '',
    }),
    required: true,
  },
});
const defaultGroup = ref('');
const changeData = (sig: string) => {
  defaultGroup.value = sig;
  const param = { sig };
  Object.assign(param, props.param);
  getCustomePkgList(param).then((data: AnyObj) => {
    data;
    const {
      data: { rpms = [] },
    } = data;
    commonAssignArray(sourceArr, getContainPkg(rpms));
  });
};

const getContainPkg = (arr: StringObj[]) => {
  return arr.map((item) => ({
    key: item['short-name'],
    label: item['short-name'],
    selected: false,
  }));
};
// source内容展示
const sourceArr: CommonOptionsItem[] = reactive([]);

// target内容展示
const targetArr: CommonOptionsItem[] = reactive([]);

// 选中sourse框内容并记录，用于传入target
let _sourceArr: CommonOptionsItem[] = [];
const getSourceSelectData = (e: CommonOptionsItem[]) => {
  _sourceArr = e;
};
// 选中target框内容并记录，用于删除target内容
let _targetArr: CommonOptionsItem[] = [];
const getTargetSelectData = (e: CommonOptionsItem[]) => {
  _targetArr = e;
};
const addTargetData = () => {
  const _data = cloneDeep(_sourceArr);
  const data = _data.filter((item) => {
    item.selected = false;
    return !targetArr.some((it) => it.key === item.key);
  });
  targetArr.unshift(...data);
};
const removeTargetData = () => {
  const data = targetArr.filter((item) => {
    item.selected = false;
    return !_targetArr.some((it) => it.key === item.key);
  });
  commonAssignArray(targetArr, data);
};

// 外部调用获取选择值
const getTargetArr = () => {
  return targetArr.map((item) => item.key);
};
defineExpose({
  getTargetArr,
});
</script>
<template>
  <div class="common-content-block change-packages">
    <div class="left">
      <div class="common-level-one-color common-level-one-fz m-b-24">Group:</div>
      <ProductSelect :value="defaultGroup" :options="group" type="group" class="m-b-24" @change-data="changeData($event)"></ProductSelect>
      <ProductFileSelect :options="sourceArr" width="100%" height="124px" @select-data="getSourceSelectData($event)"></ProductFileSelect>
    </div>
    <div class="mid">
      <SvgIcon class="m-b-40 move-btm" name="arrow-right" @click="addTargetData"></SvgIcon>
      <SvgIcon class="move-btm" name="arrow-left" @click="removeTargetData"></SvgIcon>
    </div>
    <div class="right">
      <div class="common-level-one-color common-level-one-fz m-b-24">Target:</div>
      <ProductFileSelect :options="targetArr" height="200px" width="100%" @select-data="getTargetSelectData($event)"></ProductFileSelect>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.change-packages {
  display: flex;
  justify-content: space-between;
  .left {
    width: 46%;
  }
  .right {
    width: 46%;
  }
  .mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    .move-btm {
      cursor: pointer;
      width: 86px;
      height: 66px;
    }
  }
}
</style>
