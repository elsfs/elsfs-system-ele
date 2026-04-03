<script lang="ts" setup>
import type { BasisTableProps } from './type';

import { ref } from 'vue';

import { Operation, Refresh, SetUp } from '@element-plus/icons-vue';

const props = defineProps<BasisTableProps>();
const emit = defineEmits(['change', 'selectionChange', 'refresh']);

// 选中的行
const selectedRows = ref<any[]>([]);

// 表格密度
const size = ref<'default' | 'large' | 'small'>('default');

// 列显示设置
const columnSettings = ref<Record<string, boolean>>({});
const showColumnSettings = ref(false);

// 初始化列设置
const initColumnSettings = () => {
  props.columns.forEach((col) => {
    if (col.type !== 'selection') {
      columnSettings.value[col.prop] = true;
    }
  });
};

// 处理分页变化
const handleCurrentChange = (page: number) => {
  emit('change', page, props.pagination?.pageSize);
};

const handlePageSizeChange = (size: number) => {
  emit('change', props.pagination?.current, size);
};

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
  emit('selectionChange', selection);
};

// 处理刷新
const handleRefresh = () => {
  emit('refresh');
};

// 处理密度设置
const handleTableSizeChange = (val: 'default' | 'large' | 'small') => {
  size.value = val;
};

// 初始化列设置
initColumnSettings();
</script>

<template>
  <div class="basis-table">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="left">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="right">
        <slot name="toolbar-right"></slot>

        <!-- 分隔线 -->
        <div class="divider"></div>

        <!-- 刷新按钮 -->
        <el-button :icon="Refresh" circle @click="handleRefresh">
          <el-tooltip content="刷新" placement="top">
            <span class="tooltip-trigger">刷新</span>
          </el-tooltip>
        </el-button>

        <!-- 密度设置 -->
        <el-dropdown trigger="click" @command="handleTableSizeChange">
          <el-button circle>
            <el-tooltip content="密度" placement="top">
              <el-icon><Operation /></el-icon>
            </el-tooltip>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="large">宽松</el-dropdown-item>
              <el-dropdown-item command="default">默认</el-dropdown-item>
              <el-dropdown-item command="small">紧凑</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 列设置 -->
        <el-popover
          v-model:visible="showColumnSettings"
          :width="240"
          placement="bottom"
          trigger="click"
        >
          <template #reference>
            <el-button circle>
              <el-tooltip content="列设置" placement="top">
                <el-icon><SetUp /></el-icon>
              </el-tooltip>
            </el-button>
          </template>
          <div class="column-settings">
            <div class="column-settings__header">
              <span>列展示</span>
              <el-button
                link
                type="primary"
                @click="
                  () => {
                    const allChecked = props.columns.every(
                      (col) =>
                        col.type === 'selection' || columnSettings[col.prop],
                    );
                    props.columns.forEach((col) => {
                      if (col.type !== 'selection') {
                        columnSettings[col.prop] = !allChecked;
                      }
                    });
                  }
                "
              >
                {{
                  props.columns.every(
                    (col) =>
                      col.type === 'selection' || columnSettings[col.prop],
                  )
                    ? '全部隐藏'
                    : '全部显示'
                }}
              </el-button>
            </div>
            <el-scrollbar max-height="300">
              <div class="column-settings__body">
                <div class="column-settings__grid">
                  <el-checkbox
                    v-for="col in props.columns.filter(
                      (c) => c.type !== 'selection',
                    )"
                    :key="col.prop"
                    v-model="columnSettings[col.prop]"
                    :disabled="col.fixed === 'right'"
                  >
                    {{ col.label }}
                  </el-checkbox>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-popover>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="table-container">
      <el-table
        :data="data"
        :height="height"
        :size="size"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择列 -->
        <el-table-column
          v-if="props.columns.some((col) => col.type === 'selection')"
          align="center"
          fixed="left"
          type="selection"
          width="50"
        />

        <!-- 其他列 -->
        <template
          v-for="col in props.columns.filter(
            (c) => c.type !== 'selection' && columnSettings[c.prop],
          )"
          :key="col.prop"
        >
          <el-table-column
            :align="col.align"
            :fixed="col.fixed"
            :label="col.label"
            :min-width="col.minWidth"
            :prop="col.prop"
            :width="col.width"
          >
            <template v-if="col.slot" #default="scope">
              <slot
                :index="scope.$index"
                :name="col.slot"
                :row="scope.row"
              ></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <!-- 分页 -->
      <div v-if="pagination" class="pagination-container">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.basis-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--el-bg-color);
  border-radius: 4px;

  .table-toolbar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .right {
      display: flex;
      gap: 8px;
      align-items: center;

      .divider {
        width: 1px;
        height: 16px;
        margin: 0 8px;
        background-color: var(--el-border-color);
      }

      .tooltip-trigger {
        display: none;
      }

      :deep(.el-button) {
        .el-icon {
          margin: 0;
        }
      }
    }
  }

  .table-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 16px;
    overflow: hidden;

    .el-table {
      flex: 1;

      // 增强表头样式
      :deep(.el-table__header-wrapper) {
        .el-table__header {
          th {
            height: 48px;
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            background-color: var(--el-fill-color-light);

            .cell {
              padding: 8px 12px;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;
    padding: 16px 0;
    margin-top: 8px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .column-settings {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      span {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }

    &__body {
      padding: 12px;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .el-checkbox {
        padding: 4px 8px;
        margin-right: 0;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        &.is-disabled {
          cursor: not-allowed;
          opacity: 0.7;

          &:hover {
            background-color: transparent;
          }
        }

        :deep(.el-checkbox__label) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

:deep(.el-table) {
  .el-table__row.selected {
    background-color: var(--el-table-row-hover-bg-color);
  }
}
</style>
