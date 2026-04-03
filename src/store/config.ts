import type { SysConfig } from '#/api/devOps/sysConfig';

import { defineStore } from 'pinia';

import { getConfigByConfigKey } from '#/api/devOps/sysConfig';

interface SysConfigState {
  config: Map<string, SysConfig>;
  errKey: string[];
}

export const useConfigStore = defineStore('config', {
  state: (): SysConfigState => ({
    config: new Map<string, SysConfig>(),
    errKey: [],
  }),

  actions: {
    /**
     * 获取指定键的值
     * @function
     * @param {string} configKey - 配置key
     * @returns {object | null} - 返回指定键对应的值，如果找不到则返回 null
     */
    async getConfig(configKey: string): Promise<SysConfig | undefined> {
      if (this.errKey.includes(configKey)) {
        return undefined;
      }
      const sysConfig = this.config.get(configKey);
      if (sysConfig) {
        return sysConfig;
      }

      try {
        const res = await getConfigByConfigKey(configKey);
        this.setConfig(configKey, res);
        return res;
      } catch {
        this.errKey.push(configKey);
        return undefined;
      }
    },
    getConfigSync(configKey: string): SysConfig | undefined {
      return this.config.get(configKey);
    },
    preloadConfig(configKeys: string[]) {
      configKeys.map((key) =>
        getConfigByConfigKey(key).then((res) => {
          this.setConfig(key, res);
          return res;
        }),
      );
    },
    getConfigToBoolean(configKey: string) {
      const config = this.getConfigSync(configKey);
      if (config) {
        return config ? config.configValue === '1' : false;
      }
      return false;
    },
    /**
     * 设置一个键值对
     * @function
     * @param {string} key - 需要设置的键
     * @param {object} value - 需要设置的值
     */
    setConfig(key: string, value: SysConfig) {
      this.config.set(key, value);
    },
  },
});
