<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Check,
  Close,
  Delete,
  Edit,
  Files,
  Loading,
  More,
  MuteNotification,
  Position,
  QuestionFilled,
  Tickets,
  Upload,
  UploadFilled,
} from '@element-plus/icons-vue';

import { useRequestHandle } from '#/api/ai/AiKnowledgeDoc';

import AiKnowledgeDocTestModal from './AiKnowledgeDocTestModal.vue';

const [DocTestModal, docTestModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AiKnowledgeDocTestModal,
});
function openDocTestModalApi(type: 'file' | 'text') {
  docTestModalApi.setData({
    type,
  });
  docTestModalApi.open();
}
const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  title: '知识库详情',
  onOpenChange,
});
async function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    reload();
  }
}
const page = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 菜单点击选中的key，用于显示和隐藏table
const selectedKey = ref<string>('document');
// 查询参数
const searchText = ref<string>('');
// 文档列表
const knowledgeDocDataList = ref<any>([]);
/**
 * 菜单点击事件
 * @param index
 */
function handleMenuClick(index) {
  selectedKey.value = index;
}

const contentStyle = {
  textAlign: 'center',
  height: '100%',
  width: '80%',
  background: '#ffffff',
};
/**
 * 加载表格
 */
async function reload(s) {
  const data = await useRequestHandle.page({ ...page });
  knowledgeDocDataList.value = data.records;
  page.total = data.total;
  page.current = data.current;
  page.size = data.size;
}
/**
 * 分页
 *
 * @param val
 */
const handleCurrentChange = (val) => {
  page.current = val;
  reload();
};

/**
 * 手工录入文本
 */
function handleCreateText() {}
function onDeleteAll() {}
</script>
<template>
  <div>
    <Modal>
      <el-row>
        <el-col :span="3">
          <el-menu
            :default-active="selectedKey"
            mode="vertical"
            @select="handleMenuClick"
          >
            <el-menu-item index="document"> 文档 </el-menu-item>
            <el-menu-item index="hitTest"> 命中测试 </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21">
          <div v-if="selectedKey === 'document'" :style="contentStyle">
            <el-input
              v-model="searchText"
              placeholder="请输入文档名称，回车搜索"
              class="search-title"
              @keyup.enter="reload"
            />
            <el-row :span="24" class="knowledge-row">
              <!--  基础卡片 -->
              <el-col :xxl="4" :xl="6" :lg="6" :md="6" :sm="12" :xs="24">
                <el-card
                  class="add-knowledge-card"
                  :body-style="{ textAlign: 'left', width: '100%' }"
                >
                  <span
                    style="
                      line-height: 18px;
                      font-weight: 500;
                      color: #676f83;
                      font-size: 12px;
                    "
                    >创建文档
                    <el-tooltip
                      placement="right-end"
                      content="知识库文档"
                      effect="dark"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </span>
                  <div
                    class="add-knowledge-doc"
                    @click="openDocTestModalApi('text')"
                  >
                    <el-icon size="17">
                      <Edit />
                    </el-icon>
                    <span>手动录入</span>
                  </div>
                  <div
                    class="add-knowledge-doc"
                    @click="openDocTestModalApi('file')"
                  >
                    <el-icon size="17">
                      <UploadFilled />
                    </el-icon>
                    <span>文件上传</span>
                  </div>
                  <div class="add-knowledge-doc">
                    <el-icon size="17">
                      <Upload />
                    </el-icon>
                    <el-upload action="/app/upload" :multiple="false" limit="1">
                      <span style="color: #676f83; font-size: 12px"
                        >文档库上传</span
                      >
                    </el-upload>
                  </div>

                  <el-dropdown
                    placement="top-end"
                    trigger="click"
                    :teleported="true"
                  >
                    <div
                      class="el-dropdown-link pointer operation"
                      @click.prevent.stop
                    >
                      <el-icon size="17"> <Delete /> </el-icon>
                    </div>
                    <template #overlay>
                      <el-menu>
                        <el-menu-item key="delete" @click="onDeleteAll">
                          <el-icon size="17">
                            <Delete />
                          </el-icon>
                          清空文档
                        </el-menu-item>
                      </el-menu>
                    </template>
                  </el-dropdown>
                </el-card>
              </el-col>
              <!--  内容卡片 -->
              <el-col
                :xxl="4"
                :xl="6"
                :lg="6"
                :md="6"
                :sm="12"
                :xs="24"
                v-for="item in knowledgeDocDataList"
              >
                <el-card
                  class="knowledge-card pointer"
                  :class="[
                    {
                      checked: item.__checked,
                    },
                  ]"
                >
                  <div class="knowledge-checkbox">
                    <el-checkbox
                      v-model:checked="item.__checked"
                      @click.stop=""
                    />
                  </div>
                  <div class="knowledge-header">
                    <div class="header-text flex">
                      <el-icon size="32" color="#00a7d0">
                        <Files v-if="item.type === 'text'" />
                        <MuteNotification v-if="item.type === 'file'" />
                      </el-icon>
                      <span class="ellipsis header-title">{{
                        item.title
                      }}</span>
                    </div>
                  </div>
                  <div class="card-description">
                    <span>{{ item.content }}</span>
                  </div>
                  <div class="flex" style="justify-content: space-between">
                    <div class="card-text">
                      <div
                        v-if="item.docStatus === 'complete'"
                        class="card-text-status"
                      >
                        <el-icon size="16" color="#56D1A7">
                          <Check />
                        </el-icon>
                        <span class="ml-2">已完成</span>
                      </div>
                      <div
                        v-else-if="item.docStatus === 'building'"
                        class="card-text-status"
                      >
                        <el-space
                          v-if="item.loading"
                          :spinning="item.loading"
                          :indicator="indicator"
                        />
                        <el-icon><Loading /></el-icon>
                        <span class="ml-2">构建中</span>
                      </div>
                      <div
                        v-else-if="item.docStatus === 'draft'"
                        class="card-text-status"
                      >
                        <el-icon><Tickets /></el-icon>
                        <span class="ml-2">草稿</span>
                      </div>
                      <el-tooltip
                        v-else-if="item.docStatus === 'failed'"
                        title="-----------------"
                      >
                        <div class="card-text-status">
                          <el-icon size="16" color="#FF4D4F"><Close /></el-icon>

                          <span class="ml-2">失败</span>
                        </div>
                      </el-tooltip>
                    </div>
                    <el-dropdown placement="bottom-end" :trigger="['click']">
                      <div
                        class="ant-dropdown-link pointer operation"
                        @click.prevent.stop
                      >
                        <el-icon size="16"><More /></el-icon>
                      </div>
                      <template #overlay>
                        <el-menu>
                          <el-menu-item
                            key="vectorization"
                            @select="reload(item.KnowledgeDocId)"
                          >
                            <el-icon size="16"><Position /></el-icon>
                            向量化
                          </el-menu-item>
                          <el-menu-item key="edit" @click="reload">
                            <el-icon size="16"><Edit /></el-icon>
                            编辑
                          </el-menu-item>
                          <el-menu-item
                            key="delete"
                            @click="reload(item.KnowledgeDocId)"
                          >
                            <el-icon size="16" color="red"><Delete /></el-icon>
                            删除
                          </el-menu-item>
                        </el-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- 分页组件 -->
        <el-pagination
          style="display: flex; justify-content: center; width: 100%"
          background
          layout="total, prev, pager, next"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </Modal>
    <DocTestModal />
  </div>
</template>

<style scoped lang="less">
.pointer {
  cursor: pointer;
}

.hit-test {
  box-sizing: border-box;
  flex-wrap: wrap;
  text-align: left;
  display: flex;
  margin-bottom: 10px;

  h4 {
    font-weight: bold;
    font-size: 16px;
    align-self: center;
    margin-bottom: 0;
    color: #1f2329;
  }

  span {
    margin-left: 10px;
    color: #8f959e;
    font-weight: 400;
    align-self: center;
    margin-top: 2px;
  }
}

.hit-test-footer {
  margin-top: 10px;
  display: flex;
}
.param {
  text-align: left;
  margin-top: 10px;
  ul {
    margin-top: 10px;
    display: flex;
    li {
      align-items: center;
      margin-right: 10px;
      display: flex;
    }
  }
  border-bottom: 1px solid #cec6c6;
}
.content {
  height: calc(100vh - 300px);
  padding: 8px;
  border-radius: 10px;
  background-color: #f9fbfd;
  overflow-y: auto;
  .content-title {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    margin-left: 10px;
    display: flex;
    span {
      margin-left: 4px;
      font-size: 20px;
      align-self: center;
    }
  }
  .content-card {
    margin-top: 20px;
    margin-left: 10px;
    .hit-card {
      height: 160px;
      margin-bottom: 10px;
      margin-right: 10px;
      border-radius: 10px;
      background: #fcfcfd;
      border: 1px solid #f0f0f0;
      box-shadow: 0 2px 4px #e6e6e6;
      transition: all 0.3s ease;
      .card-title {
        justify-content: space-between;
        color: #887a8b;
        font-size: 14px;
        display: flex;
      }
    }
  }
}
.hit-card:hover {
  box-shadow: 0 6px 12px #d0d3d8 !important;
}
.pointer {
  cursor: pointer;
}

.card-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  height: 6em;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  margin-top: 16px;
  text-align: left;
  font-size: 12px;
  color: #676f83;
}

.card-title-tag {
  color: #477dee;
}

.knowledge-row {
  padding: 16px;
  overflow-y: auto;
}

.add-knowledge-card {
  border-radius: 10px;
  margin-bottom: 20px;
  display: inline-flex;
  font-size: 16px;
  height: 166px;
  width: calc(100% - 20px);
  background: #fcfcfd;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px #e6e6e6;
  transition: all 0.3s ease;
  .add-knowledge-card-icon {
    padding: 8px;
    margin-right: 12px;
  }
}

.knowledge-card {
  border-radius: 10px;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 166px;
  background: #fcfcfd;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 4px #e6e6e6;
  transition: all 0.3s ease;

  .knowledge-checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    align-items: center;
    justify-content: center;
    display: none;
  }

  &:hover,
  &.checked {
    .knowledge-checkbox {
      display: flex;
    }
  }

  &.checked {
    border: 1px solid #1890ff;
  }

  .knowledge-header {
    position: relative;
    font-size: 14px;
    height: 20px;
    text-align: left;
    .header-img {
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }
    .header-title {
      font-weight: bold;
      color: #354052;
      margin-left: 4px;
      align-self: center;
    }

    .header-text {
      overflow: hidden;
      position: relative;
      display: flex;
      font-size: 16px;
    }
  }
}

.add-knowledge-card,
.knowledge-card {
  transition: box-shadow 0.3s ease;
}

.add-knowledge-card:hover,
.knowledge-card:hover {
  box-shadow: 0 6px 12px #d0d3d8;
}

.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
  width: calc(100% - 30px);
}

:deep(.el-card .el-card-body) {
  padding: 16px;
}

.card-text {
  font-size: 12px;
  display: flex;
  margin-top: 10px;
  align-items: center;
}

.search-header {
  margin-top: 10px;
  margin-left: 26px;

  .search-input {
    width: 240px;
    display: block;
  }
}

.operation {
  border: none;
  margin-top: 10px;
  align-items: end;
  display: none !important;
  bottom: 8px;
  right: 4px;
  position: absolute;
}

.add-knowledge-card:hover,
.knowledge-card:hover {
  .operation {
    display: block !important;
  }
}

.add-knowledge-doc {
  margin-top: 6px;
  color: #6f6f83;
  font-size: 13px;
  width: 100%;
  cursor: pointer;
  display: flex;
  span {
    margin-left: 4px;
    line-height: 28px;
  }
}
.add-knowledge-doc:hover {
  background: #c8ceda33;
}
.operation {
  background-color: unset;
  border: none;
  margin-right: 2px;
}
.operation:hover {
  color: #000000;
  background-color: #e9ecf2;
  border: none;
}
.el-dropdown-link {
  font-size: 14px;
  height: 24px;
  padding: 0 7px;
  border-radius: 4px;
  align-content: center;
  text-align: center;
}
.card-footer {
  margin-top: 4px;
  font-weight: 400;
  color: #1f2329;
  text-align: left;
  font-size: 12px;
}
.card-text-status {
  display: flex;
  align-items: center;
}
.ml-2 {
  margin-left: 2px;
}
.add-knowledge-doc {
  :deep(.el-upload) {
    width: 100%;
  }
}
</style>
<style lang="less">
.airag-knowledge-doc .scroll-container {
  padding: 0 !important;
}
</style>
