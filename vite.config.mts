import { defineConfig } from '@vben/vite-config';

import AutoImport from 'unplugin-auto-import/vite';
import ElementPlus from 'unplugin-element-plus/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
        AutoImport({
          resolvers: [
            ElementPlusResolver(),
            // Auto import icon components
            // 自动导入图标组件
            IconsResolver({
              prefix: 'Icon',
            }),
          ],
        }),
        Components({
          resolvers: [
            ElementPlusResolver(),
            // Auto register icon components
            // 自动注册图标组件
            IconsResolver({
              enabledCollections: ['ep'],
            }),
          ],
        }),
        Icons({
          autoInstall: true,
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            // target: 'http://8.137.19.169:6002',
            target: 'http://localhost:6002',

            ws: true,
          },
        },
      },
    },
  };
});
