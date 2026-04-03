import type { StdDictItem } from '#/api/devOps/dictItem';

import { defineStore } from 'pinia';

interface DictState {
  dictSet: Map<string, StdDictItem[]>;
}
export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictSet: new Map<string, StdDictItem[]>(),
  }),

  actions: {
    /**
     * 获取指定键的值
     * @function
     * @param {string} dictCode - 需要获取的键
     * @returns {object | null} - 返回指定键对应的值，如果找不到则返回 null
     */
    getDict(dictCode: string): null | Promise<StdDictItem[]> {
      try {
        const item = this.dictSet.get(dictCode);
        return item?.[dictCode] || null;
      } catch {
        return null;
      }
    },
    /**
     * 设置一个键值对
     * @function
     * @param {string} key - 需要设置的键
     * @param {object} value - 需要设置的值
     */
    setDict(key, value) {
      if (!key || typeof key !== 'string') {
        return;
      }
      this.dictSet.set(key, value);
    },
  },
});
