import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    dynamicTitle: true,
    /**
     * 权限模式
     * backend 后端权限模式
     * frontend 前端权限模式
     */
    accessMode: 'backend',
    // 登录注册页面布局 panel-center居中
    authPageLayout: 'panel-center',
    /** 是否显示偏好设置 */
    enablePreferences: true,
    name: import.meta.env.VITE_APP_TITLE,
  },
  breadcrumb: {
    /** 面包屑风格 */
    styleType: 'background',
  },
  copyright: {
    /** 版权公司名 */
    companyName: 'elsfs 公司',
    /** 版权公司名链接 */
    companySiteLink: 'http://elsfs.cn',
    /** 版权日期 */
    date: '2025',
    /** 版权是否可见 */
    enable: true,
    /** 备案号 */
    icp: 'ICP-2025088-1',
    /** 备案号链接 */
    icpLink: 'http://elsfs.cn',
    /** 设置面板是否显示*/
    settingShow: false,
  },
  header: {
    mode: 'auto-scrol',
  },
  theme: {
    mode: 'light',
    /** 内置主题名 */
    builtinType: 'default',
    // 错误色
    colorDestructive: 'hsl(348 100% 61%)',
    // 主题色
    colorPrimary: 'hsl(212 100% 45%)',
    // 成功色
    colorSuccess: 'hsl(144 57% 58%)',
    // 警告色
    colorWarning: 'hsl(42 84% 61%)',
    /** 是否开启半深色header（只在theme='light'时生效） */
    semiDarkHeader: false,

    semiDarkSidebar: false,
  },
});
