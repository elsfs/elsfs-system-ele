import type { App } from 'vue';

import { defineAsyncComponent } from 'vue';

import { ElMessage } from 'element-plus';

import { requestClient } from '#/api/request';
// 引入组件
const SvgIcon = defineAsyncComponent(
  () => import('#/components/SvgIcon/index.vue'),
);

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function elSvg(app: App) {
  const icons = svg as any;
  for (const i in icons) {
    app.component(`ele-${icons[i].name}`, icons[i]);
  }
  app.component('SvgIcon', SvgIcon);
}
/**
 * 统一批量导出
 * @method elSvg 导出全局注册 element plus svg 图标
 * @method useTitle 设置浏览器标题国际化
 * @method setTagsViewNameI18n 设置 自定义 tagsView 名称、 自定义 tagsView 名称国际化
 * @method lazyImg 图片懒加载
 * @method globalComponentSize() element plus 全局组件大小
 * @method deepClone 对象深克隆
 * @method isMobile 判断是否是移动端
 * @method handleEmpty 判断数组对象中所有属性是否为空，为空则删除当前行对象
 * @method handleOpenLink 打开外部链接
 */
const other = {
  elSvg: (app: App) => {
    elSvg(app);
  },
  /**
   *
   * @param str 驼峰转下划线
   * @returns 下划线
   */
  toUnderline: (str: string) => {
    return str.replaceAll(/([A-Z])/g, '_$1').toLowerCase();
  },
  /**
   *
   * @param url 目标下载接口
   * @param query 查询参数
   * @param fileName 文件名称
   * @returns {*}
   */
  downBlobFile: (url: any, query: any, fileName: string) => {
    requestClient
      .download(url, {
        params: query,
      })
      .then((response) => {
        handleBlobFile(response, fileName);
      });
  },
  addUnit: (value: number | string, unit = 'px') => {
    return addUnit(value, unit);
  },
};

/**
 * blob 文件刘处理
 * @param response 响应结果
 * @returns
 */
export function handleBlobFile(response: any, fileName: string) {
  // 处理返回的文件流
  const blob = response;
  if (blob && blob.size === 0) {
    ElMessage.error('内容为空，无法下载');
    return;
  }
  const link = document.createElement('a');

  // 兼容一下 入参不是 File Blob 类型情况
  const binaryData = [] as any;
  binaryData.push(response);
  link.href = window.URL.createObjectURL(new Blob(binaryData));
  link.download = fileName;
  document.body.append(link);
  link.click();
  window.setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    URL.revokeObjectURL(blob);
    link.remove();
  }, 0);
}
/**
 * @description 生成唯一 uuid
 * @return string
 */
export function generateUUID() {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    if (
      typeof crypto.getRandomValues === 'function' &&
      typeof Uint8Array === 'function'
    ) {
      const callback = (c: any) => {
        const num = Number(c);
        return (
          num ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
        ).toString(16);
      };
      return '10000000-1000-4000-8000-100000000000'.replaceAll(
        /[018]/g,
        callback,
      );
    }
  }
  let timestamp = Date.now();
  let performanceNow =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (c) => {
    let random = Math.random() * 16;
    if (timestamp > 0) {
      random = Math.trunc((timestamp + random) % 16);
      timestamp = Math.floor(timestamp / 16);
    } else {
      random = Math.trunc((performanceNow + random) % 16);
      performanceNow = Math.floor(performanceNow / 16);
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

/**
 * @description 添加单位
 * @param {string | number} value 值 100
 * @param {string} unit 单位 px em rem
 */
const addUnit = (value: number | string, unit = 'px') => {
  return Object.is(Number(value), Number.NaN) ? value : `${value}${unit}`;
};

// 统一批量导出
export default other;
