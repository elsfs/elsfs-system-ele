<script setup lang="ts">
import type { TableColumn } from '#/components/table/type';
import type { TableParams } from '#/types';

import { ref } from 'vue';

import { useRequestUser } from '#/api/core/api';
import BasisTable from '#/components/table/BasisTable.vue';

interface Props {
  multiple?: boolean;
  modelValue?: any | any[];
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  modelValue: () => [],
});

const emit = defineEmits(['ok', 'update:modelValue', 'confirm']);
type BusinessType = 'dept' | 'role';
interface BusinessTypeInterface {
  type: BusinessType;
  id: number | string;
}
const dialogVisible = ref(false);
const loading = ref(false);
const dataList = ref([]);
const selectedRows = ref<any[]>([]);
const businessType = ref<BusinessTypeInterface>({});

const { useRequestHandle } = useRequestUser;

// 分页参数
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});
// 搜索表单配置

const searchConfig = [
  {
    prop: 'nickname',
    label: '昵称',
    component: 'el-input',
    placeholder: '请输入用户昵称',
  },
  {
    label: '用户名',
    prop: 'username',
    component: 'el-input',
    placeholder: '请输入用户名',
  },
  {
    label: '手机号',
    prop: 'phone',
    component: 'el-input',
    placeholder: '请输入手机号',
  },
];

// 表格列配置
const columns: TableColumn[] = [
  {
    type: 'selection',
    width: 50,
    align: 'center',
  },
  {
    prop: 'username',
    label: '用户名',
    minWidth: 120,
  },
  {
    prop: 'nickname',
    label: '昵称',
    minWidth: 120,
  },
  {
    prop: 'phone',
    label: '手机号',
    minWidth: 120,
  },
  {
    prop: 'status',
    label: '状态',
    width: 80,
    slot: 'status',
  },
];

// 获取用户列表
const fetchUserList = async (params: TableParams = {}) => {
  try {
    loading.value = true;

    if (businessType.value.type === 'dept') {
      const result = await useRequestHandle.page({
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
        deptId: businessType.value.id,
        ...params,
      });
      dataList.value = result.records;
      pagination.value = {
        current: result.current,
        pageSize: result.size,
        total: result.total,
      };
    }
    if (businessType.value.type === 'role') {
      const result = await useRequestHandle.page({
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
        roleId: businessType.value.id,
        ...params,
      });
      dataList.value = result.records;
      pagination.value = {
        current: result.current,
        pageSize: result.size,
        total: result.total,
      };
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 页码改变
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.current = page;
  pagination.value.pageSize = pageSize;
  fetchUserList();
};

// 选择改变
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

// 确认选择
const handleConfirm = () => {
  if (selectedRows.value.length === 0) {
    return;
  }
  emit(
    'update:modelValue',
    props.multiple ? selectedRows.value : selectedRows.value[0],
  );
  emit('confirm', props.multiple ? selectedRows.value : selectedRows.value[0]);
  dialogVisible.value = false;
};
// 重置处理
const handleReset = () => {
  pagination.value.current = 1;
  fetchUserList();
};
// 搜索处理
const handleSearch = (formData: Record<string, any>) => {
  pagination.value.current = 1;
  fetchUserList(formData);
};
// 打开选择器
const open = async (data: BusinessTypeInterface) => {
  dialogVisible.value = true;
  businessType.value = data;
  await fetchUserList();
};

defineExpose({
  open,
});
</script>

<template>
  <el-dialog v-model="dialogVisible" title="选择用户" width="800px">
    <!-- 搜索区域 -->
    <SearchForm
      :col-count="3"
      :default-show-count="3"
      :search-config="searchConfig"
      @reset="handleReset"
      @search="handleSearch"
    />
    <BasisTable
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :pagination="pagination"
      height="500px"
      @change="handlePageChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 状态列 -->
      <template #status="{ row }">
        <el-tag :type="row.status === '0' ? 'success' : 'danger'">
          {{ row.status === '0' ? '正常' : '停用' }}
        </el-tag>
      </template>
    </BasisTable>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
