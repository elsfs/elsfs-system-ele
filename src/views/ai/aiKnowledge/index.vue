<script lang="ts" setup>
import type { VxeGridInstance } from 'vxe-table';

import type { AiKnowledge } from '#/api/ai/aiKnowledge';

import { onMounted, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Delete,
  Edit,
  MoreFilled,
  Notification,
  Plus,
  RefreshLeft,
  Search,
  Share,
  Switch,
} from '@element-plus/icons-vue';

import { useRequestHandle } from '#/api/ai/aiKnowledge';
import PageView from '#/components/PageView/index.vue';

import { gridOptions } from './aiKnowledge.data';
import AiKnowledgeModal from './AiKnowledgeModal.vue';
import AiKnowledgeBaseModal from './components/AiKnowledgeBaseModal.vue';

const isCard = ref(true);
const total = ref(0); // 总数
const pageSize = ref(10); // 每页数量
const currentPage = ref(1); // 当前页
// 查询区域表单的ref
const formRef = ref();
// 模型列表
const knowledgeList = ref<AiKnowledge[]>([]);
// 查询参数
const queryParam = reactive<any>({});
const activeCard = ref<null | string>(null);

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AiKnowledgeModal,
});
const [KnowledgeBaseModal, knowledgeBaseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AiKnowledgeBaseModal,
  fullscreen: true,
});
/**
 * 打开modal
 *
 * @param row
 */
function handleOpenModal(row: AiKnowledge) {
  modalApi.setData({
    isUpdate: !!row,
    data: row,
  });
  modalApi.open();
}

/**
 * 重置
 */
function searchReset() {
  formRef.value.resetFields();
  queryParam.name = '';
  // 刷新数据
  reload();
}
/**
 * 刷新数据
 */
async function reload() {
  const data = await useRequestHandle.page({
    ...queryParam,
    current: currentPage.value,
    pages: pageSize.value,
    total: total.value,
  });
  knowledgeList.value = data.records;
  total.value = data.total;
}
/**
 * 分页
 *
 * @param val
 */
const handleCurrentChange = (val) => {
  currentPage.value = val;
  reload();
};

/**
 * 查询
 */
function searchQuery() {
  handleCurrentChange();
}
/**
 * 知识库向量化
 * @param id
 */
async function handleVectorization(id) {
  // todo 向量化
}

/**
 * 删除知识库
 * @param item
 */
async function handleDelete(item) {
  await useRequestHandle.del(item.knowledgeId, reload);
}
/**
 * 删除知识库
 * @param item
 */
async function handleClearDocument(item) {
  // todo 清空 文档
}

/**
 * 参数配置点击事件
 *
 * @param id
 */
function handleDocClick(id) {
  console.log('打开知识库', id);
  knowledgeBaseModalApi.open();
  // openDocModal(true, { id });
}

/**
 * 切换
 */
function handleSwitch() {
  isCard.value = !isCard.value;
}

function hideDropdown() {
  activeCard.value = null;
}
const gridRef = ref<VxeGridInstance<AiKnowledge>>();
onMounted(() => handleCurrentChange());
</script>

<template>
  <div class="knowledge">
    <!--查询区域-->
    <div class="basic-table-form-container">
      <el-form
        ref="formRef"
        @keyup.enter="searchQuery"
        :model="queryParam"
        :label-col="{ xs: 24, sm: 4, xl: 6, xxl: 6 }"
        :wrapper-col="{ xs: 24, sm: 20 }"
        style="background-color: #f7f8fc"
      >
        <el-row :gutter="24">
          <el-col :xl="7" :lg="7" :md="8" :sm="24">
            <el-form-item name="name" label="知识库名称">
              <el-input
                v-model="queryParam.name"
                placeholder="请输入知识库名称"
                @keyup.enter="searchQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="7" :md="8" :sm="24">
            <span
              style="float: left; overflow: hidden"
              class="table-page-search-submitButtons"
            >
              <el-col :lg="6">
                <el-button type="primary" :icon="Search" @click="searchQuery">
                  查询
                </el-button>
                <el-button
                  :loading="false"
                  type="primary"
                  :icon="RefreshLeft"
                  @click="searchReset"
                  style="margin-left: 8px"
                  >重置</el-button
                >
                <el-button
                  :loading="false"
                  type="primary"
                  :icon="Switch"
                  @click="handleSwitch"
                  style="margin-left: 8px"
                >
                  切换</el-button
                >
              </el-col>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 知识库卡片列表 -->

    <div v-if="isCard">
      <el-row :span="24" class="knowledge-row">
        <el-col :xxl="4" :xl="6" :lg="6" :md="6" :sm="12" :xs="24">
          <el-card class="add-knowledge-card" @click="handleOpenModal(null)">
            <div class="flex">
              <el-icon size="30">
                <Plus />
              </el-icon>
              <span class="add-knowledge-card-title">创建知识库</span>
            </div>
          </el-card>
        </el-col>
        <!--  知识库卡片列表 后台获取    -->
        <el-col
          :xxl="4"
          :xl="6"
          :lg="6"
          :md="6"
          :sm="12"
          :xs="24"
          v-for="item in knowledgeList"
        >
          <el-card
            class="knowledge-card pointer"
            @mouseleave="hideDropdown(item.id)"
          >
            <div
              @click="handleDocClick(item.id)"
              class="knowledge-card-content"
            >
              <div class="knowledge-header">
                <div class="flex">
                  <img
                    class="header-img"
                    src="/knowledge.png"
                    alt="knowledge"
                  />
                  <div class="header-text">
                    <span
                      class="header-text-top header-name ellipsis"
                      :title="item.name"
                    >
                      {{ item.name }}
                    </span>
                    <span class="header-text-top">
                      创建者：{{ item.createBy }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-desc mt-10">
                <span>{{ item.description || '暂无描述' }}</span>
              </div>
              <div class="knowledge-footer">
                <el-icon><Share /></el-icon>
                <span> {{ item.modelName }}</span>
              </div>
            </div>
            <!-- 更多 -->
            <div
              class="knowledge-btn"
              :class="{ 'show-btn': activeCard === item.id }"
            >
              <el-dropdown
                placement="top-end"
                trigger="click"
                popper-class="knowledge-dropdown"
                :teleported="true"
              >
                <div class="el-dropdown-link pointer model-icon">
                  <el-icon><MoreFilled /></el-icon>
                </div>
                <template #dropdown>
                  <el-menu>
                    <el-menu-item
                      key="vectorization"
                      @click="handleVectorization(item.id)"
                    >
                      <el-icon size="10"><Notification /></el-icon>
                      向量化
                    </el-menu-item>
                    <el-menu-item key="text" @click="handleOpenModal(item)">
                      <el-icon size="10"><Edit /></el-icon>
                      编辑
                    </el-menu-item>
                    <el-menu-item key="file" @click="handleDelete(item)">
                      <el-icon size="10">
                        <Delete />
                      </el-icon>
                      删除
                    </el-menu-item>
                    <el-menu-item
                      key="del"
                      @click.prevent.stop="handleClearDocument(item)"
                    >
                      <el-icon size="10">
                        <Delete />
                      </el-icon>
                      清空文档
                    </el-menu-item>
                  </el-menu>
                </template>
              </el-dropdown>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 分页组件 -->
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <div v-if="!isCard">
      <PageView>
        <vxe-grid ref="gridRef" v-bind="gridOptions">
          <template #action="{ row }">
            <el-button type="primary"> 测试</el-button>
          </template>
        </vxe-grid>
      </PageView>
    </div>
    <Modal @refresh="reload" />
    <KnowledgeBaseModal @refresh="reload" />
  </div>
</template>
<style scoped lang="less">
.knowledge {
  height: calc(100vh - 115px);
  background: #f7f8fc;
  padding: 24px;
  overflow-y: auto;

  .knowledge-row {
    max-height: calc(100% - 100px);
    margin-top: 20px;
    overflow-y: auto;

    .knowledge-header {
      position: relative;
      font-size: 14px;
      height: 40px;

      .header-img {
        width: 34px;
        height: 34px;
        margin-right: 6px;
      }

      .header-text {
        width: calc(100% - 80px);
        overflow: hidden;
        position: relative;
        display: grid;

        .header-name {
          font-size: 14px !important;
          font-weight: bold;
          color: #354052 !important;
        }

        .header-text-top {
          height: 22px;
          font-size: 12px;
        }
      }
    }
  }
}

.text-desc {
  width: 100%;
  font-weight: 400;
  display: inline-block;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 40px;
  overflow: hidden;
  font-size: 12px;
  color: #676f83;
}

.knowledge-footer {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 16px;

  .knowledge-footer-icon {
    position: relative;
    top: 2px;
  }

  span {
    margin-left: 2px;
  }
}

.flex {
  display: flex;
  align-items: center;
}

:deep(.el-card .el-card-body) {
  padding: 16px;
}

.mt-10 {
  margin-top: 10px;
}

.ml-4 {
  margin-left: 4px;
}

.knowledge-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  height: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;

  &.show-btn {
    opacity: 1;
  }
}

.add-knowledge-card {
  margin-bottom: 20px;
  background: #fcfcfd;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  height: 152px;
  width: calc(100% - 20px);

  .add-knowledge-card-icon {
    padding: 8px;
    color: #1f2329;
    background-color: #f5f6f7;
    margin-right: 12px;
  }

  .add-knowledge-card-title {
    font-size: 16px;
    color: #1f2329;
    font-weight: 400;
    align-self: center;
  }
}

.add-knowledge-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.knowledge-card {
  margin-right: 20px;
  margin-bottom: 20px;
  height: 152px;
  border-radius: 10px;
  background: #fcfcfd;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.knowledge-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

  .knowledge-btn {
    display: block;
    opacity: 1;
  }
}

.pointer {
  cursor: pointer;
}

.list-footer {
  text-align: right;
  margin-top: 5px;
}

.basic-table-form-container {
  padding: 0;

  :deep(.el-form) {
    background-color: transparent;
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}

.model-icon {
  background-color: unset;
  border: none;
  margin-right: 2px;
}

.model-icon:hover {
  color: #000000;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
}

.el-dropdown-link {
  font-size: 14px;
  height: 24px;
  padding: 0 7px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.knowledge-dropdown) {
  z-index: 3000;
}

:deep(.el-menu-item) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  margin: 0;
  font-size: 12px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
