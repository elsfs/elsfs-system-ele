import type { Fn } from '@vueuse/core';
import type { CellStyle } from 'element-plus';

import { onMounted } from 'vue';

import { ElMessage } from 'element-plus';

import other from '#/utils/other';

/**
 * 分页属性配置接口
 */
export interface Pagination {
  current: number;
  size: number;
  total: number;
  pageSizes?: number[];
  layout?: string;
}

/**
 * 表格组件基础配置属性
 */
export interface BasicTableProps {
  createdIsNeed?: boolean;
  isPage?: boolean;
  queryForm?: Record<string, any>;
  dataList?: any[];
  pagination?: Pagination;
  dataListLoading?: boolean;
  dataListSelections?: any[];
  pageList?: (...arg: any) => Promise<any>;
  loading?: boolean;
  selectObjs?: any[];
  descs?: string[];
  ascs?: string[];
  props?: Record<string, any>;
  spanMethod?: Fn;
}

/**
 * 表格样式
 */
export interface TableStyle {
  rowStyle: CellStyle<any>;
  cellStyle: CellStyle<any>;
  headerCellStyle: CellStyle<any>;
}

interface TableOptions {
  ascs: any[];
  createdIsNeed: boolean;
  dataList: any[];
  dataListLoading: boolean;
  dataListSelections: any[];
  descs: any[];
  isPage: boolean;
  loading: boolean;
  pagination: Pagination;
  props: { item: string; totalCount: string };
  queryForm: any;
  selectObjs: any[];
}

export function useTable(options?: BasicTableProps) {
  const defaultOptions: TableOptions = {
    dataListLoading: false,
    createdIsNeed: true,
    isPage: true,
    queryForm: {},
    dataList: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
      pageSizes: [1, 10, 20, 50, 100, 200],
      layout: 'total, sizes, prev, pager, next, jumper',
    },
    dataListSelections: [],
    loading: false,
    selectObjs: [],
    descs: [],
    ascs: [],
    props: {
      item: 'records',
      totalCount: 'total',
    },
  };

  const mergeDefaultOptions = (options: any, props: any): BasicTableProps => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key];
      }
    }
    return props;
  };

  const state = mergeDefaultOptions(defaultOptions, options || {});

  const query = async () => {
    if (state.pageList) {
      try {
        state.loading = true;

        // 清理空值
        if (state.queryForm) {
          Object.keys(state.queryForm).forEach((key) => {
            if (
              state.queryForm?.[key] === '' ||
              state.queryForm?.[key] === null
            ) {
              delete state.queryForm![key];
            }
          });
        }

        const res = await state.pageList({
          ...state.queryForm,
          current: state.pagination?.current,
          size: state.pagination?.size,
          descs: state.descs?.join(','),
          ascs: state.ascs?.join(','),
        });

        state.dataList = state.isPage ? res[state.props?.item] : res;
        if (state.spanMethod) {
          state.spanMethod();
        }

        if (state.pagination) {
          state.pagination.total = state.isPage
            ? res.data[state.props?.totalCount]
            : 0;
        }
      } catch (error: any) {
        ElMessage.error(error.msg || error.data?.msg || '查询失败');
      } finally {
        state.loading = false;
      }
    }
  };

  onMounted(() => {
    if (state.createdIsNeed) {
      query();
    }
  });

  const sizeChangeHandle = (val: number) => {
    if (state.pagination) {
      state.pagination.size = val;
      query();
    }
  };

  const currentChangeHandle = (val: number) => {
    if (state.pagination) {
      state.pagination.current = val;
      query();
    }
  };

  const sortChangeHandle = (column: any) => {
    const prop = other.toUnderline(column.prop);
    if (column.order === 'descending') {
      state.descs?.push(prop);
      if (state.ascs?.includes(prop)) {
        state.ascs?.splice(state.ascs.indexOf(prop), 1);
      }
    } else if (column.order === 'ascending') {
      state.ascs?.push(prop);
      if (state.descs?.includes(prop)) {
        state.descs?.splice(state.descs.indexOf(prop), 1);
      }
    } else {
      if (state.ascs?.includes(prop)) {
        state.ascs?.splice(state.ascs.indexOf(prop), 1);
      }
      if (state.descs?.includes(prop)) {
        state.descs?.splice(state.descs.indexOf(prop), 1);
      }
    }
    query();
  };

  const getDataList = (refresh?: boolean) => {
    if (refresh !== false && state.pagination) {
      state.pagination.current = 1;
    }
    query();
  };

  const downBlobFile = (url: string, query: any, fileName: string) => {
    return other.downBlobFile(url, query, fileName);
  };

  const tableStyle: TableStyle = {
    cellStyle: { textAlign: 'center' },
    headerCellStyle: {
      textAlign: 'center',
      background: 'var(--el-table-row-hover-bg-color)',
      color: 'var(--el-text-color-primary)',
    },
    rowStyle: { textAlign: 'center' },
  };

  return {
    tableStyle,
    getDataList,
    sizeChangeHandle,
    currentChangeHandle,
    sortChangeHandle,
    downBlobFile,
  };
}
