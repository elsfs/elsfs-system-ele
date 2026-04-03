<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { ElMessage, ElTree } from 'element-plus';

import {
  getMenuIdByRoleId,
  saveRoleMenu,
  useRequestHandle,
} from '#/api/system/sysMenu';

const treeRef = ref<InstanceType<typeof ElTree>>();

// tree data
const dataTree = ref<Record<string, any>[]>([]);
// all key
const allKeys = ref<string[]>();
// 默认展开的 key
const defaultExpandedKeys = ref<string[]>();
// 默认选中的 key
const selectedKeys = ref<string[]>();
const [Drawer, drawerApi] = useVbenDrawer({
  title: '角色授权',
  onOpenChange,
  onConfirm: handleSubmit,
});
async function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const { roleId } = drawerApi.getData<any>();
    dataTree.value = await useRequestHandle.tree();
    allKeys.value = allKeyHandle(dataTree.value);
    defaultExpandedKeys.value = allKeys.value;
    selectedKeys.value = await getMenuIdByRoleId(roleId);
  }
}
const getCheckedKeysHandle = () => {
  return treeRef.value!.getCheckedKeys(false);
};
async function handleSubmit() {
  const { roleId } = drawerApi.getData<any>();
  const selectedKeys = getCheckedKeysHandle();
  if (selectedKeys.length === 0) {
    ElMessage.error('请选择菜单');
    return;
  }
  await saveRoleMenu({ roleId, menuIds: selectedKeys });
  ElMessage.success('保存成功');
  drawerApi.close();
}
/**
 * 获取所有key
 * @param node
 */
function allKeyHandle(node: any[]): string[] {
  const keys: string[] = [];
  node.forEach((item) => {
    keys.push(item.menuId);
    if (item.children) {
      keys.push(...allKeyHandle(item.children));
    }
  });
  return keys;
}
const defaultProps = {
  // 指定子树为节点对象的某个属性值
  children: 'children',
  // 指定节点标签为节点对象的某个属性值
  label: 'menuName',
};
</script>
<template>
  <Drawer>
    <ElTree
      ref="treeRef"
      :data="dataTree"
      :default-checked-keys="selectedKeys"
      :default-expanded-keys="defaultExpandedKeys"
      :props="defaultProps"
      node-key="menuId"
      show-checkbox
      style="max-width: 600px"
    />
  </Drawer>
</template>
