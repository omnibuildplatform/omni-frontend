<script setup lang="ts">
import { reactive, ref, nextTick, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { getBuildResult, queryProductData, startBuild } from '@/api/api';
import { defineComponent } from 'vue-demi';
import ProductSelect from './product-select/ProductSelect.vue';
import FileSelect from './file-select/FileSelect.vue';
import { AnyObj } from '@/shared/interface/interface';
import { ElScrollbar } from 'element-plus';
import ProductProgress from './product-progress/ProductProgress.vue';
import ProductButton from './product-button/ProductButton.vue';
import ProductTransfer from './product-transfer/ProductTransfer.vue';
import { getUserAuth } from '@/shared/utils/login';

defineComponent({
  ProductSelect,
  FileSelect,
});
onMounted(() => {
  startLocalWS();
});
onBeforeUnmount(() => {
  if (ws) {
    // 关闭ws链接
    ws.close();
  }
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
    item.value = pre[0];
  });
});

const changeData = (e: string, type: string) => {
  selectArr.forEach((item) => {
    if (item.id === type) {
      item.value = e;
    }
  });
};

const disabledBuildBtn = ref(false);
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
  clearWsDataBar();
  startBuild(data).then((res: AnyObj) => {
    window.localStorage.setItem('wsData', JSON.stringify(res));
    createWSData(res);
  });
};

const startLocalWS = () => {
  const ws = window.localStorage.getItem('wsData');
  if (ws) {
    // 启动ws
    createWSData(JSON.parse(ws));
  }
};

const clearLocalWS = () => {
  window.localStorage.removeItem('wsData');
};
const productTransfer = ref<null | AnyObj>(null);
const getProductTransferData = () => {
  return productTransfer?.value?.getTargetArr() || [];
};
const wsData = ref(['']);

// 进度条
const wsDataBar = reactive({
  status: '',
  percentage: 0,
  download: '',
});

// 暂时使用假数据展示进度条
const wsDataBarProcess = () => {
  if (wsDataBar.percentage < 99) {
    wsDataBar.percentage = Math.round(wsDataBar.percentage * 1000 + 10) / 1000;
  }
};

// 进度条跑完后需请求接口判断是否成功，success获取url，failed获取失败日志
const queryBuildResult = (data: string, id: string) => {
  getBuildResult(data, id).then((res) => {
    if (res.data.status === 'succeed') {
      wsDataBar.percentage = 100;
      wsDataBar.status = 'success';
      wsDataBar.download = res.data.url;
    } else if (res.data.status === 'failed') {
      wsDataBar.percentage = 100;
      wsDataBar.status = 'exception';
      wsData.value[wsData.value.length - 1] += '\n';
      wsData.value[wsData.value.length - 1] += res.data.error;
    }
  });
};

// 清空进度条数据
const clearWsDataBar = () => {
  wsDataBar.percentage = 0;
  wsDataBar.status = '';
  wsDataBar.download = '';
  wsData.value = [''];
};

// 创建wbsocket长链接，监控日志
let ws: WebSocket;
const createWSData = (res: AnyObj) => {
  const { token } = getUserAuth();
  if (!token) {
    return;
  }
  const { data, title } = res;
  const host = window.location.host;
  disabledBuildBtn.value = true;
  const url = `wss://${host}/ws/queryJobStatus?jobname=${data}`;
  ws = new WebSocket(url, [token]);
  ws.onclose = () => {
    disabledBuildBtn.value = false;
    wsData.value[wsData.value.length - 1] += '\n';
    clearLocalWS();
  };
  ws.onmessage = (evt) => {
    const result = JSON.parse(evt.data);
    if (result.code === 1) {
      // 成功
      queryBuildResult(data, title);
    } else if (result.code === -1) {
      // 失败
      wsDataBar.status = 'exception';
    } else if (result.code === 99) {
      // 心跳保持
      return;
    } else {
      // 数据连接中
      wsDataBarProcess();
    }
    if (!(Math.round(wsDataBar.percentage * 100) % 50)) {
      wsData.value.push('');
    }
    wsData.value[wsData.value.length - 1] += result?.data || '';
  };
};

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

// 日志数据变化，滚动条在底部
watch(
  () => wsData.value[wsData.value.length - 1],
  () => {
    nextTick(() => {
      const dom = document.getElementById('log_contain') || ({} as HTMLElement);
      const { scrollHeight } = dom;
      scrollbarRef.value?.setScrollTop(scrollHeight);
    });
  }
);
</script>
<template>
  <div class="body">
    <div class="top-main m-b-64">
      <div v-for="selectItem in selectArr" :key="selectItem.name" class="m-b-16">
        <p class="common-level-one-color common-level-one-fz m-b-40 text-center text-ellipsis">{{ selectItem.name }}:</p>
        <ProductSelect :value="selectItem.value" :options="selectItem.data" width="328px" @change-data="changeData($event, selectItem.id)"></ProductSelect>
      </div>
    </div>
    <div class="common-level-one-color common-level-one-fz text-center m-b-24">Packages</div>
    <div class="common-content-block m-b-16 default-packages">
      <div class="common-level-one-color common-level-one-fz m-b-24">Default:</div>
      <div class="common-level-two-fz m-b-24 warning-tips">
        WARNING:The packages in the below list is the default package list to build up a basic usable openEuler dotnbutilon, please do nor modify the below list
        unless you avre aware of what you are doing
      </div>
      <FileSelect :options="defaultPackages" width="100%" columns="3"></FileSelect>
    </div>
    <div class="m-b-24">
      <ProductTransfer ref="productTransfer" :group="sigsGroup" :param="getCustomeParam"></ProductTransfer>
    </div>
    <div class="m-b-24 flex flex-center">
      <ProductButton class="build-btn" data="build" :disabled="disabledBuildBtn" @p-click="build"></ProductButton>
      <ProductButton data="download" :disabled="!Boolean(wsDataBar.download)" :download="wsDataBar.download"></ProductButton>
    </div>
    <div class="common-content-block">
      <div>
        <div class="common-level-one-color common-level-two-fz">Building...</div>
        <ProductProgress class="m-b-24 m-t-24" :value="wsDataBar.percentage" :status="wsDataBar.status"></ProductProgress>
      </div>
      <div class="common-text-content-block">
        <el-scrollbar ref="scrollbarRef" height="600px">
          <div id="log_contain" class="common-level-two-color common-level-two-fz log-contain">
            <p v-for="item in wsData" :key="item" class="log-data">{{ item }}</p>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.top-main {
  display: flex;
  justify-content: space-between;
}
.default-packages {
  height: 416px;
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
