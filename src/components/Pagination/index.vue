<script setup lang="ts">
defineOptions({ name: 'Pagination' });
const props = defineProps({
  current: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array as () => number[],
    default: () => {
      return [1, 10, 20, 50, 100, 200];
    },
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
});

const emit = defineEmits(['sizeChange', 'currentChange']);

// 分页改变
const sizeChangeHandle = (val: number) => {
  emit('sizeChange', val);
};
// 分页改变
const currentChangeHandle = (val: number) => {
  emit('currentChange', val);
};
</script>

<template>
  <el-pagination
    :current-page="props.current"
    :layout="props.layout"
    :page-size="props.size"
    :page-sizes="props.pageSizes"
    :pager-count="5"
    :total="props.total"
    background
    class="mt15"
    @current-change="currentChangeHandle"
    @size-change="sizeChangeHandle"
  />
</template>
