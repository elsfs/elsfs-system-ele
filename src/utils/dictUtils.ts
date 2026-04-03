import type { Ref } from 'vue';

import type { StdDictItem } from '#/api/devOps/dictItem';

import { ref, toRefs } from 'vue';

import { getListByDictCode } from '#/api/devOps/dict';
import { useDictStore } from '#/store';

/**
 * 获取字典数据
 */
export function useDict(...args: string[]): Record<string, Ref<StdDictItem[]>> {
  const res = ref<any | Record<string, StdDictItem[]>>({});
  return (() => {
    args.forEach((dictCode: string) => {
      res.value[dictCode] = [];
      const dicts = useDictStore().getDict(dictCode);
      if (dicts) {
        res.value[dictCode] = dicts;
      } else {
        getListByDictCode(dictCode).then((respList) => {
          res.value[dictCode] = respList.map((resp) => ({
            dictItemId: resp.dictItemId,
            label: resp.label,
            value: resp.value,
            parentId: resp.parentId,
            depth: resp.depth,
            customType: resp.customType,
            css: resp.css,
            icon: resp.icon,
            status: resp.status,
            orderNo: resp.orderNo,
          }));
          useDictStore().setDict(dictCode, res.value);
        });
      }
    });
    return toRefs(res.value);
  })();
}
export function useDictOne(dictCode: string): StdDictItem[] {
  const dict = useDict(dictCode);
  return dict[dictCode].value;
}
