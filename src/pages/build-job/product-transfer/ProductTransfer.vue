<script setup lang="ts">
import ProductSelect from '../product-select/ProductSelect.vue';
import ProductFileSelect from '../product-file-select/ProductFileSelect.vue';
import { ref, watch } from 'vue';
import { AnyObj, CommonOptionsItem } from '@/shared/interface/interface';
import { getCustomePkgList } from '@/api/api';
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
  defaultTargetArr: {
    type: Array,
    default: () => [],
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
    sourceArr.value = getContainPkg(rpms);
  });
};

const getContainPkg = (arr: any[]) => {
  return arr.map((item) => ({
    key: item['short-name'] || item,
    label: item['short-name'] || item,
    selected: false,
  }));
};
// source内容展示
const sourceArr = ref([] as CommonOptionsItem[]);

// target内容展示
const targetArr = ref([] as CommonOptionsItem[]);
// 默认值设置
watch(
  () => props.defaultTargetArr,
  () => {
    targetArr.value = getContainPkg(props.defaultTargetArr);
  },
  { deep: true }
);

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
    return !targetArr.value.some((it) => it.key === item.key);
  });
  targetArr.value.unshift(...data);
};
const removeTargetData = () => {
  const data = targetArr.value.filter((item) => {
    item.selected = false;
    return !_targetArr.some((it) => it.key === item.key);
  });
  targetArr.value = data;
};

// 外部调用获取选择值
const getTargetArr = () => {
  return targetArr.value.map((item) => item.key);
};
defineExpose({
  getTargetArr,
});
</script>
<template>
  <div class="change-packages">
    <div class="left">
      <div class="left-select common-level-one-color common-level-one-fz m-b-24">
        <span>Group:</span>
        <ProductSelect :value="defaultGroup" :options="group" type="group" width="360px" @change-data="changeData($event)"></ProductSelect>
      </div>
      <ProductFileSelect :options="sourceArr" width="100%" height="200px" @select-data="getSourceSelectData($event)"></ProductFileSelect>
    </div>
    <div class="mid">
      <el-button class="move-btm" @click="addTargetData">
        加入
        <SvgIcon name="arrow-right"></SvgIcon>
      </el-button>
      <span class="m-b-40"></span>
      <el-button class="move-btm" @click="removeTargetData">
        <SvgIcon name="arrow-left"></SvgIcon>
        减去
      </el-button>
    </div>
    <div class="right">
      <div class="right-title common-level-one-color common-level-one-fz m-b-24">Custom:</div>
      <ProductFileSelect :options="targetArr" height="200px" width="100%" @select-data="getTargetSelectData($event)"></ProductFileSelect>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../../../shared/styles/handle.scss';
.change-packages {
  display: flex;
  justify-content: space-between;
  .left {
    width: 46%;
    &-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .right {
    width: 46%;
    &-title {
      height: 40px;
    }
  }
  .mid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    .move-btm {
      width: 112px;
      height: 48px;
      border: 1px solid;
      @include border_color('bg-color3');
      @include font_color('bg-color3');
    }
  }
}
</style>
