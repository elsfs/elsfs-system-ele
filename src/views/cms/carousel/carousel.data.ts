import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import dayjs from 'dayjs';

import { useRequestHandle } from '#/api/cms/carousel';

export interface Carousel {
  carouselId: string;
  title: string;
  imageUrl: string;
  description: string;
  css: string;
  jumpUrl: string;
  sortValue: number;
  createdAt: string;
  updatedAt: string;
}
const columns: VxeGridPropTypes.Columns<Carousel> = [
  { type: 'checkbox', width: 50 },
  { field: 'title', title: '标题', treeNode: true },
  { field: 'imageUrl', title: '图片', cellRender: { name: 'CellImage' } },
  { field: 'description', title: '描述' },
  { field: 'css', width: 50, title: '颜色' },
  {
    field: 'createAt',
    title: '创建时间',
    width: 200,
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY年MM月DD日') : '';
    },
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];

/**
 * Configuration options for the grid component.
 * @template RowType - The type of data rows in the grid.
 * @type {VxeGridProps<RowType>}
 */
export const gridOptions: VxeGridProps<Carousel> = {
  columns,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: (_, formValues) => {
        return useRequestHandle.list(formValues);
      },
    },
  },
  exportConfig: {},

  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore 正式环境时有完整的类型声明
    search: true,
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};
