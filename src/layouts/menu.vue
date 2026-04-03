<!--
  登录页
 -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Search } from '@element-plus/icons-vue';

onMounted(() => {
  menuList.value = [
    {
      name: '菜单1',
      id: '1',
      children: [
        { name: '菜单1-1', id: '1-1' },
        { name: '菜单1-2', id: '1-2' },
        { name: '菜单1-3', id: '1-3' },
        { name: '菜单1-4', id: '1-4' },
        { name: '菜单1-5', id: '1-5' },
        { name: '菜单1-6', id: '1-6' },
        { name: '菜单1-7', id: '1-7' },
        { name: '菜单1-8', id: '1-8' },
        { name: '菜单1-9', id: '1-9' },
        { name: '菜单1-10', id: '1-10' },
        { name: '菜单1-11', id: '1-11' },
        { name: '菜单1-12', id: '1-12' },
        { name: '菜单1-13', id: '1-13' },
      ],
    },
    {
      name: '菜单2',
      id: '2',
      children: [
        { name: '菜单2-1', id: '2-1' },
        { name: '菜单2-2', id: '2-2' },
        { name: '菜单2-3', id: '2-3' },
        { name: '菜单2-4', id: '2-4' },
        { name: '菜单2-5', id: '2-5' },
        { name: '菜单2-6', id: '2-6' },
        { name: '菜单2-7', id: '2-7' },
      ],
    },
    {
      name: '菜单3',
      id: '3',
      children: [
        { name: '菜单3-1', id: '3-1' },
        { name: '菜单3-2', id: '3-2' },
        { name: '菜单3-3', id: '3-3' },
        { name: '菜单3-4', id: '3-4' },
        { name: '菜单3-5', id: '3-5' },
        { name: '菜单3-6', id: '3-6' },
        { name: '菜单3-7', id: '3-7' },
        { name: '菜单3-8', id: '3-8' },
        { name: '菜单3-9', id: '3-9' },
        { name: '菜单3-10', id: '3-10' },
      ],
    },
    {
      name: '菜单4',
      id: '4',
      children: [
        { name: '菜单4-1', id: '4-1' },
        { name: '菜单4-2', id: '4-2' },
        { name: '菜单4-3', id: '4-3' },
        { name: '菜单4-4', id: '4-4' },
        { name: '菜单4-5', id: '4-5' },
        { name: '菜单4-6', id: '4-6' },
      ],
    },
    {
      name: '菜单5',
      id: '5',
      children: [
        { name: '菜单5-1', id: '5-1' },
        { name: '菜单5-2', id: '5-2' },
        { name: '菜单5-3', id: '5-3' },
        { name: '菜单5-4', id: '5-4' },
        { name: '菜单5-5', id: '5-5' },
        { name: '菜单5-6', id: '5-6' },
        { name: '菜单5-7', id: '5-7' },
        { name: '菜单5-8', id: '5-8' },
        { name: '菜单5-9', id: '5-9' },
        { name: '菜单5-10', id: '5-10' },
        { name: '菜单5-11', id: '5-11' },
        { name: '菜单5-12', id: '5-12' },
        { name: '菜单5-13', id: '5-13' },
      ],
    },
    {
      name: '菜单5',
      id: '5',
      children: [
        { name: '菜单5-1', id: '5-1' },
        { name: '菜单5-2', id: '5-2' },
        { name: '菜单5-3', id: '5-3' },
        { name: '菜单5-4', id: '5-4' },
        { name: '菜单5-5', id: '5-5' },
        { name: '菜单5-6', id: '5-6' },
        { name: '菜单5-7', id: '5-7' },
        { name: '菜单5-8', id: '5-8' },
        { name: '菜单5-9', id: '5-9' },
        { name: '菜单5-10', id: '5-10' },
        { name: '菜单5-11', id: '5-11' },
        { name: '菜单5-12', id: '5-12' },
        { name: '菜单5-13', id: '5-13' },
      ],
    },
    {
      name: '菜单5',
      id: '5',
      children: [
        { name: '菜单5-1', id: '5-1' },
        { name: '菜单5-2', id: '5-2' },
        { name: '菜单5-3', id: '5-3' },
        { name: '菜单5-4', id: '5-4' },
        { name: '菜单5-5', id: '5-5' },
        { name: '菜单5-6', id: '5-6' },
        { name: '菜单5-7', id: '5-7' },
        { name: '菜单5-8', id: '5-8' },
        { name: '菜单5-9', id: '5-9' },
        { name: '菜单5-10', id: '5-10' },
        { name: '菜单5-11', id: '5-11' },
        { name: '菜单5-12', id: '5-12' },
        { name: '菜单5-13', id: '5-13' },
      ],
    },
    {
      name: '菜单5',
      id: '5',
      children: [
        { name: '菜单5-1', id: '5-1' },
        { name: '菜单5-2', id: '5-2' },
        { name: '菜单5-3', id: '5-3' },
        { name: '菜单5-4', id: '5-4' },
        { name: '菜单5-5', id: '5-5' },
        { name: '菜单5-6', id: '5-6' },
        { name: '菜单5-7', id: '5-7' },
        { name: '菜单5-8', id: '5-8' },
        { name: '菜单5-9', id: '5-9' },
        { name: '菜单5-10', id: '5-10' },
        { name: '菜单5-11', id: '5-11' },
        { name: '菜单5-12', id: '5-12' },
        { name: '菜单5-13', id: '5-13' },
      ],
    },
    {
      name: '菜单5',
      id: '5',
      children: [
        { name: '菜单5-1', id: '5-1' },
        { name: '菜单5-2', id: '5-2' },
        { name: '菜单5-3', id: '5-3' },
        { name: '菜单5-4', id: '5-4' },
        { name: '菜单5-5', id: '5-5' },
        { name: '菜单5-6', id: '5-6' },
        { name: '菜单5-7', id: '5-7' },
        { name: '菜单5-8', id: '5-8' },
        { name: '菜单5-9', id: '5-9' },
        { name: '菜单5-10', id: '5-10' },
        { name: '菜单5-11', id: '5-11' },
        { name: '菜单5-12', id: '5-12' },
        { name: '菜单5-13', id: '5-13' },
        { name: '菜单5-14', id: '5-14' },
      ],
    },
    {
      name: '菜单6',
      id: '6',
      children: [{ name: '菜单5-1', id: '5-1' }],
    },
  ];
});

const showMenuDrawer = ref(false);
// 全部菜单
const menuList = ref([]);
// 左侧菜单
const leftMenu = computed(() => {
  return menuList.value.map((item) => {
    return { name: item.name, id: item.id };
  });
});
// 搜索值
const searchVal = ref('');
const activeMenu = ref(-1);
const activeMenuList = computed(() => {
  if (activeMenu.value === -1) {
    return filterTreeByName(menuList.value);
  } else {
    const id = menuList.value[activeMenu.value].id;
    const list = menuList.value.filter((item) => item.id === id);
    return filterTreeByName(list);
  }
});
function filterTreeByName(list) {
  if (!searchVal.value) return list;
  const lowerKeyword = searchVal.value.toLowerCase();
  return list
    .map((item) => {
      const nameMatch = item.name.toLowerCase().includes(lowerKeyword);
      // 如果有 children，递归过滤
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterTreeByName(item.children);
        // 父级命中 or 子级有命中
        if (nameMatch || filteredChildren.length > 0) {
          return {
            ...item,
            children: nameMatch ? item.children : filteredChildren,
          };
        }
      } else if (nameMatch) {
        return item;
      }
      return null;
    })
    .filter(Boolean);
}
</script>
<template>
  <el-button type="primary" @click="showMenuDrawer = true">打开菜单</el-button>

  <!-- 抽屉弹窗 -->
  <el-drawer
    v-model="showMenuDrawer"
    title="菜单列表"
    direction="ltr"
    size="1200px"
  >
    <div class="menu-container">
      <!-- 左侧菜单 -->
      <div class="left-menu">
        <div
          class="item"
          :class="{ active: activeMenu === -1 }"
          @click="activeMenu = -1"
        >
          全部
        </div>
        <div
          class="item"
          v-for="(item, index) in leftMenu"
          :class="{ active: activeMenu === index }"
          :key="index"
          @click="activeMenu = index"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- 右侧菜单 -->
      <div class="right">
        <div class="search">
          <el-input
            v-model="searchVal"
            placeholder="请输入"
            clearable
            :prefix-icon="Search"
          />
        </div>
        <el-scrollbar>
          <!-- 一级菜单 -->
          <div
            class="one-level-wrap"
            v-for="(item, index) in activeMenuList"
            :key="index"
          >
            <div class="one-level-menu">{{ item.name }}</div>
            <!-- 二级菜单 -->
            <div class="two-level-wrap">
              <div
                class="two-level-menu"
                v-for="(c, ids) in item.children"
                :key="ids"
              >
                <div>{{ c.name }}</div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-drawer>
</template>
<style scoped lang="scss">
.menu-container {
  display: flex;
  height: calc(100vh - 150px);

  .left-menu {
    width: 200px;

    .item {
      height: 40px;
      padding-left: 20px;
      line-height: 40px;
      cursor: pointer;

      &.active {
        color: red;
      }

      &:hover {
        background: #fbfbfb;
      }
    }
  }

  .right {
    flex: 1;

    .search {
      height: 50px;
      // width: 300px;
    }

    .one-level-wrap {
      .one-level-menu {
        text-align: center;
      }

      .two-level-wrap {
        display: flex;
        flex-wrap: wrap;

        .two-level-menu {
          width: 33.33%;
          height: 40px;
          padding-left: 20px;
          line-height: 40px;

          &:hover {
            cursor: pointer;
            background: #fbfbfb;
          }
        }
      }
    }
  }
}
</style>
