<script lang="ts" setup>
defineProps({
  loading: Boolean,
  loadingText: {
    type: String,
    default: '加载中...',
  },
  padding: {
    type: Boolean,
    default: true,
  },
  background: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="page-view" :class="[{ 'is-pg': padding, 'is-bg': background }]">
    <slot></slot>
    <vxe-loading :model-value="loading" :text="loadingText" />
  </div>
</template>

<style lang="scss" scoped>
.page-view {
  position: relative;
  min-width: 800px;
  height: 100%;
  overflow: auto;
  border-radius: 6px;

  &.is-pg {
    padding: 16px;
  }

  &.is-bg {
    background-color: var(--page-layout-body-background-color);
  }
}
</style>
