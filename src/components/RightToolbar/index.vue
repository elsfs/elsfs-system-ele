<script setup lang="ts">
import { computed, defineEmits, defineOptions } from 'vue';

import { Download, Refresh, Search } from '@element-plus/icons-vue';

defineOptions({ name: 'RightToolbar', inheritAttrs: false });
/**
 * 通过 defineProps 函数定义组件 props
 */
const props = defineProps({
  /**
   * 是否显示搜索框
   */
  showSearch: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否导出
   */
  export: {
    type: [String, Boolean],
    default: null,
  },
  /**
   * 是否显示搜索框
   */
  search: {
    type: Boolean,
    default: true,
  },
  style: {
    type: Object,
    default: () => ({}),
  },
  /**
   * 列表项之间的间距
   */
  gutter: {
    type: Number,
    default: 10,
  },
});
const emits = defineEmits(['update:showSearch', 'queryTable', 'exportExcel']);
const style = computed(() => {
  const ret = {};
  // 如果props中有传入gutter属性，则计算出marginRight
  if (props.gutter) {
    ret.marginRight = `${props.gutter / 2}px`;
  }
  return ret; // 返回计算后的样式对象
});

// 搜索
const toggleSearch = () => {
  emits('update:showSearch', !props.showSearch);
};

// 刷新
const handleRefresh = () => {
  emits('queryTable');
};

// 导出excel
const handleExport = () => {
  emits('exportExcel');
};

// 是否导出
const isExport = () => {
  if (props.export === true) {
    return true;
  }
};
</script>

<template>
  <div :style="style" class="top-right-btn">
    <el-row>
      <!-- 搜索框控制 -->
      <el-tooltip
        v-if="search"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        class="item"
        effect="dark"
        placement="top"
      >
        <el-button circle @click="toggleSearch()">
          <Search style="width: 1em; height: 1em; margin: 8px" />
        </el-button>
      </el-tooltip>

      <!-- 导出 -->
      <el-tooltip
        v-if="isExport()"
        class="item"
        content="导出"
        effect="dark"
        placement="top"
      >
        <el-button circle @click="handleExport()">
          <Download style="width: 1em; height: 1em; margin: 8px" />
        </el-button>
      </el-tooltip>

      <!-- 刷新功能 -->
      <el-tooltip class="item" content="刷新" effect="dark" placement="top">
        <el-button circle @click="handleRefresh()">
          <Refresh style="width: 1em; height: 1em; margin: 8px" />
        </el-button>
      </el-tooltip>

      <!-- 插槽 -->
      <slot></slot>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.top-right-btn {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
