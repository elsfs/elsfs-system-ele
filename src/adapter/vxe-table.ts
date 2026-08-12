import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { ElButton, ElImage, ElTag } from 'element-plus';

import { useDictOne } from '#/utils/dictUtils';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'records',
            total: 'total',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(renderOpts, params) {
        const { props } = renderOpts;
        const { column, row } = params;
        const src = row[column.field];
        return h(ElImage, { src, previewSrcList: [src], ...props });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          ElButton,
          { size: 'small', link: true },
          { default: () => props?.text },
        );
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
    vxeUI.renderer.add('Icon', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        const name = row[column.field];
        return h(createIconifyIcon(name));
      },
    });
    vxeUI.renderer.add('Dict', {
      renderTableDefault({ options, props }, { column, row }) {
        const dict = props.dict;
        const dictOps = useDictOne(dict);

        const name = row[column.field];
        if (!dictOps) {
          return name;
        }
        // 获取dictOps 的dict
        for (const dictOp of dictOps) {
          if (dictOp.value === name) {
            return h(
              ElTag,
              { type: dictOp?.css, effect: 'kight' },
              { default: () => dictOp.label },
            );
          }
        }
        return name;
      },
    });
    //  vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
