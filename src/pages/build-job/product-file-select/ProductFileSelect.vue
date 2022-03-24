<script setup lang="ts">
import { Search, Check } from '@element-plus/icons-vue';
import { reactive, ref, watch } from 'vue';
import { CommonOptionsItem } from '@/shared/interface/interface';
import { cloneDeep } from 'lodash';
import { commonAssignArray } from '@/shared/methods/common';

const props = defineProps({
  options: {
    type: Array as () => CommonOptionsItem[],
    required: true,
    default: () => [],
  },
  width: {
    type: String,
    default: '400px',
  },
  height: {
    type: String,
    default: '150px',
  },
});
const searchValue = ref('');
// options副本，记录选中状态
let _options: CommonOptionsItem[] = [];
// options展示副本，可供搜索
let _searchOption: CommonOptionsItem[] = reactive([]);
watch(
  () => props.options,
  () => {
    _options = cloneDeep(props.options);
    commonAssignArray(_searchOption, searchData(_options));
  },
  { deep: true }
);
watch(
  () => searchValue.value,
  () => {
    // 搜索展示
    const data = searchData(_options);
    commonAssignArray(_searchOption, data);
  }
);
const searchData = (data: CommonOptionsItem[]) => {
  return cloneDeep(
    data.filter((item) => {
      const label: string = item.label?.toLocaleUpperCase() || '';
      const search = searchValue.value.toLocaleUpperCase();
      return label.includes(search);
    })
  );
};
const emit = defineEmits(['selectData']);

const clickCheckBox = (defaultItem: CommonOptionsItem) => {
  // 切换展示副本状态
  defaultItem.selected = !defaultItem.selected;
  const { key } = defaultItem;
  const findOne = _options.find((item) => item.key === key);
  if (findOne) {
    // 切换副本状态
    findOne.selected = !findOne?.selected;
  }
  emit('selectData', getAllSelectData());
};
// 获取所有选中项
const getAllSelectData = () => {
  return _options.filter((item) => item.selected);
};
</script>
<template>
  <div class="common-text-content-block">
    <el-input v-model="searchValue" placeholder="Please input" class="m-b-16 search">
      <template #prepend>
        <el-button :icon="Search" />
      </template>
    </el-input>
    <div class="m-b-16 line"></div>
    <el-scrollbar :height="height">
      <div class="common-level-two-fz common-level-two-color" :style="{ width }">
        <div v-for="defaultItem in _searchOption" :key="defaultItem.key" class="m-b-8 flex">
          <div class="flex flex-center select-box" :class="defaultItem.selected && 'selected'" @click="clickCheckBox(defaultItem)">
            <el-icon v-if="defaultItem.selected" color="#ffffff"><check /></el-icon>
          </div>
          <div>
            {{ defaultItem.label }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<style scoped lang="scss">
::v-deep .search {
  .el-input-group__prepend {
    background-color: #161616;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    box-shadow: none;
  }
  .el-input__inner {
    background-color: #161616;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    box-shadow: none;
  }
}
.line {
  height: 2px;
  background: #424242;
  border-radius: 1px;
}

.select-box {
  margin-right: 12px;
  width: 24px;
  height: 24px;
  background: #161616;
  border-radius: 6px;
  border: 1px solid #363636;
}
.selected {
  background: linear-gradient(360deg, #622ec3 0%, #4d65db 32%, #379aee 64%, #53e9f6 100%, #13ccd7 100%);
  box-shadow: 0px 10px 20px 0px rgba(59, 45, 143, 0.25);
}
</style>
