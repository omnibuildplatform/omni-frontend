<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { queryProductData } from '@/api/api';
import { defineComponent } from 'vue-demi';
import ProductSelect from './product-select/ProductSelect.vue';
import FileSelect from './file-select/FileSelect.vue';
import { AnyObj } from '@/shared/interface/interface';
import ProductTransfer from './product-transfer/ProductTransfer.vue';

defineComponent({
  ProductSelect,
  FileSelect,
});
const props = defineProps({
  defaultValue: {
    type: Object,
    default: () => ({
      arch: '',
      release: '',
      buildType: '',
      customPkg: [],
    }),
  },
});
const selectArr = reactive([
  {
    id: 'arch',
    name: 'Architecture',
    data: [],
    value: '',
  },
  {
    id: 'release',
    name: 'Release Version',
    data: [],
    value: '',
  },
  {
    id: 'buildType',
    name: 'Output Format',
    data: [],
    value: '',
  },
]);
const getCustomeParam = computed(() => {
  const param = {
    arch: '',
    release: '',
  };
  selectArr.forEach((item) => {
    if (item.id === 'arch') {
      param.arch = item.value;
    } else if (item.id === 'release') {
      param.release = item.value;
    }
  });
  return param;
});
let defaultPackages = ref([]);
let sigsGroup: string[] = reactive([]);
queryProductData().then((res) => {
  const {
    attach: { packages = [] },
    data,
    other: { Sigs = [] },
  } = res;
  sigsGroup.push(...(Sigs || []));
  defaultPackages.value = packages;
  selectArr.forEach((item) => {
    const pre = data[item.id];
    item.data = pre;

    // 默认值优先设置
    item.value = props.defaultValue[item.id] || pre[0];
  });
});

const changeData = (e: string, type: string) => {
  selectArr.forEach((item) => {
    if (item.id === type) {
      item.value = e;
    }
  });
};

const build = () => {
  const data: AnyObj = {
    arch: '',
    release: '',
    buildType: '',
    customPkg: [],
  };
  data.customPkg = getProductTransferData();
  selectArr.forEach((item) => {
    data[item.id] = item.value;
  });
  return data;
};
const productTransfer = ref<null | AnyObj>(null);
const getProductTransferData = () => {
  return productTransfer?.value?.getTargetArr() || [];
};

defineExpose({
  build,
});
</script>
<template>
  <div class="job">
    <div class="job-config">
      <div class="job-title common-level-one-color common-level-one-fz m-b-24">Configure</div>
      <div class="job-content common-content-bg-color">
        <div class="job-config-select m-b-64">
          <div v-for="selectItem in selectArr" :key="selectItem.name">
            <p class="common-level-one-color common-level-one-fz m-b-24 text-center text-ellipsis">{{ selectItem.name }}:</p>
            <ProductSelect :value="selectItem.value" :options="selectItem.data" width="328px" @change-data="changeData($event, selectItem.id)"></ProductSelect>
          </div>
        </div>
        <div>
          <ProductTransfer ref="productTransfer" :group="sigsGroup" :param="getCustomeParam" :default-target-arr="defaultValue.customPkg"></ProductTransfer>
        </div>
      </div>
    </div>
    <div class="job-packages">
      <div class="job-title common-level-one-color common-level-one-fz m-b-24">Packages</div>
      <div class="job-content common-content-bg-color m-b-16">
        <div class="common-level-one-color common-level-one-fz m-b-8">Default:</div>
        <div class="common-level-two-fz m-b-24 warning-tips">
          WARNING:The packages in the below list is the default package list to build up a basic usable openEuler dotnbutilon, please do nor modify the below
          list unless you avre aware of what you are doing
        </div>
        <FileSelect :options="defaultPackages" width="100%" columns="3"></FileSelect>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.job {
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 40px;
  padding-bottom: 24px;
  min-width: 1024px;
  max-width: 1200px;
  &-title {
    font-weight: bold;
  }
  &-content {
    padding: 40px 64px;
  }
  &-config {
    &-select {
      display: flex;
      justify-content: space-between;
    }
  }

  &-packages {
    margin-top: 40px;
  }
}
.warning-tips {
  color: #ff6b57;
}
.log-contain {
  p:last-child {
    margin-bottom: 16px;
  }
}
.log-data {
  white-space: pre-wrap;
}
.build-btn {
  margin-right: 24px;
}
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
    padding-right: 12px;
    .remove-btn {
      margin-left: 12px;
      margin-top: 48px;
      margin-bottom: 12px;
    }
    button {
      width: 80px;
    }
  }
}
.build-progress {
  .el-button {
    width: 139px;
    height: 76px;
    font-size: 24px;
  }
}
</style>
