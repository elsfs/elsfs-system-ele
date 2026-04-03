<script lang="ts" setup>
import { defineExpose, reactive, ref } from 'vue';

import { Pane, Splitpanes } from 'splitpanes';

// ======== 显示页面 ========
const preview = reactive({
  open: false,
  titel: '代码预览',
  fileTree: [],
  activeName: '',
});
const previewCodegen = ref([]);
const previewCodeStr = ref('');
const defaultExpandedKeys = ref([]);
const handleNodeClick = async (data: any, node: any) => {
  if (node && !node.isLeaf) {
    return false;
  }
  preview.activeName = data.id;
  const filteredCode = previewCodegen.value.filter(
    (code: any) => code.codePath === data.id,
  );
  if (filteredCode.length > 0) {
    previewCodeStr.value = filteredCode[0].code;
  }
};
const visible = ref(false);
const openDialog = async (data) => {
  previewCodegen.value = data;
  const files = handleFiles(data.map((s) => s.codePath));
  preview.fileTree = handleTree(files, 'id', 'parentId', 'children', '/');
  addKey(preview.fileTree);
  visible.value = true;
};
function addKey(data: any[]) {
  if (!data) {
    return;
  }
  data.forEach((item) => {
    defaultExpandedKeys.value.push(item.id);
    if (item.children) {
      addKey(item.children);
    }
  });
}
defineExpose({
  openDialog,
});
// 列表结构转树结构
function handleTree(
  data: any[],
  id: any,
  parentId: any,
  children: any,
  rootId: any,
) {
  id = id || 'id';
  rootId =
    rootId ||
    // eslint-disable-next-line prefer-spread
    Math.min.apply(
      Math,
      data.map((item: any) => {
        return item[parentId];
      }),
    ) ||
    0;
  // 对源数据深度克隆
  const cloneData = structuredClone(data);
  // 循环所有项
  const treeData = cloneData.filter((father: any) => {
    const branchArr = cloneData.filter((child: any) => {
      // 返回每一项的子级数组
      return father[id] === child[parentId];
    });
    // eslint-disable-next-line no-unused-expressions
    branchArr.length > 0 ? (father[children] = branchArr) : '';
    // 返回第一层
    return father[parentId] === rootId;
  });
  return treeData === '' ? data : treeData;
}

/**
 * 生成 files 目录
 * @param fileTreeOriginal
 * @returns {*[]}
 */
const handleFiles = (fileTreeOriginal: any) => {
  const exists = {};
  const files = [] as any[];

  // 遍历每个元素
  for (const data of fileTreeOriginal) {
    let paths = [];
    paths = data.includes('\\') ? data.split('\\') : data.split('/');
    let fullPath = ''; // 从头开始的路径，用于生成 id
    // 遍历每个 path， 拼接成树
    for (const path of paths) {
      // 已经添加到 files 中，则跳过
      const oldFullPath = fullPath;
      // 下面的 replaceAll 的原因，是因为上面包处理了，导致和 tabs 不匹配，所以 replaceAll 下
      fullPath =
        fullPath.length === 0
          ? path
          : `${fullPath.replaceAll('.', '/')}/${path}`;
      if (exists[fullPath]) {
        continue;
      }
      // 添加到 files 中
      exists[fullPath] = true;
      files.push({
        id: fullPath,
        label: path,
        parentId: oldFullPath || '/',
        templateName: data.k,
      });
    }
  }
  return files;
};
const handleTabClick = (item: any) => {
  const filteredCode = previewCodegen.value.filter(
    (code: any) => code.codePath === item.paneName,
  );
  if (filteredCode.length > 0) {
    previewCodeStr.value = filteredCode[0].code;
  }
};
</script>

<template>
  <el-dialog
    fullscreen
    title="代码预览"
    v-model="visible"
    width="90%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
  >
    <Splitpanes>
      <Pane size="25">
        <el-scrollbar height="calc(100vh - 100px)" class="mt20">
          <el-tree
            ref="treeRef"
            node-key="id"
            :data="preview.fileTree"
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKeys"
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </Pane>
      <Pane>
        <el-tabs v-model="preview.activeName" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="item in previewCodegen"
            :label="item.codePath.substring(item.codePath.lastIndexOf('/') + 1)"
            :name="item.codePath"
            :key="item.codePath"
          />
          <code-editor
            theme="darcula"
            v-model="previewCodeStr"
            mode="go"
            read-only
            height="calc(100vh - 100px)"
          />
        </el-tabs>
      </Pane>
    </Splitpanes>
  </el-dialog>
</template>
