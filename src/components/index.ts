import type { App } from 'vue';

import DeptSelector from '#/components/business/DeptSelector.vue';
import UserSelector from '#/components/business/UserSelector.vue';
import CodeEditor from '#/components/CodeEditor/index.vue';
import Description from '#/components/description/description.vue';
import Editor from '#/components/Editor/index.vue';
import PageView from '#/components/PageView/index.vue';
import ElementIcons from '#/components/SvgIcon/svgicon';
import { TableAction } from '#/components/TableAction';

import 'splitpanes/dist/splitpanes.css';
// https://sangtian152.github.io/vue3-tree-org/
import 'vue3-tree-org/lib/vue3-tree-org.css';

export { CodeEditor, DeptSelector, Editor, ElementIcons, UserSelector };
export function initComponent(app: App) {
  app.component('DeptSelector', DeptSelector);
  app.component('UserSelector', UserSelector);
  app.component('ElementIcons', ElementIcons);
  app.component('Editor', Editor);
  app.component('CodeEditor', CodeEditor);
  app.component('PageView', PageView);
  app.component('Description', Description);
  app.component('TableAction', TableAction);
}
