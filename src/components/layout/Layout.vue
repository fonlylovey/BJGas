<template>
  <div class="app-layout">
    <!-- 底层：Viewer 铺满全屏 -->
    <div class="viewer-container">
      <Viewer />
    </div>

    <div class="layout-overlay">
      <AppHeader />
      
      <div class="layout-main">
        <LeftSlideBar @segment-selected="handleSegmentSelected" />
      </div>
      <div class = "layout-infoWidget">
        <InfoWidget 
        :title="currentInfo.title" 
        :body="currentInfo.body" 
        :image="currentInfo.image" 
        :visible="showInfoWidget"
        />
      </div>
      <AppFooter />
    </div>

    <div>
      <button class="contact-btn" id="contactBtn" title="联系我们" @click="onContact">联系我们</button>
    </div>

    <!-- 联系我们弹窗 - 使用默认插槽内容 -->
    <Modal v-model:visible="modalVisible" title="联系我们" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppHeader from './Header.vue';
import LeftSlideBar from './LeftSlideBar.vue';
import AppFooter from './Footer.vue';
import Viewer from '@/views/threeView/Viewer.vue';
import InfoWidget from './InfoWidget.vue';
import Modal from '@/components/common/Modal.vue';
import { SEGMENTSData } from '@/data/segments';

// 弹窗显示状态
const modalVisible = ref(false);
const activeSegment = ref(0);
const showInfoWidget = ref(false);
const currentInfo = computed(() => SEGMENTSData[activeSegment.value]);

const handleSegmentSelected = (index: number) => {
  activeSegment.value = index;
  if(index == 0){
    showInfoWidget.value = false;
  }
  else{
    showInfoWidget.value = true;
  }
}

const onContact = () => {
  modalVisible.value = true;
}
</script>

<style scoped>
/* 根容器：相对定位，铺满全屏 */
.app-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, sans-serif;
}

/* Viewer 容器：绝对定位铺满全屏，作为底层 */
.viewer-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.layout-overlay {
  position: relative;
  z-index: 10;
  height: 100%;
  pointer-events: none;
}

.layout-overlay > * {
  pointer-events: auto;
}

.layout-overlay .app-header {
  height: 60px;
  background-color: rgba(255, 255, 255, 0);
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.layout-infoWidget {
  width: 50%;
}

.layout-main {
  display: flex;
  width: 160px;
  height: calc(100% - 60px - 80px);
  padding-top: 8px;
}

.contact-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 180px;
  height: 48px;
  z-index: 20;
  padding: 10px 20px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #0066cc;
  font-size: 18px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 102, 204, 0.15);
  border: 1px solid rgba(0, 102, 204, 0.2);
  transition: all 0.35s ease;
}

.contact-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #0066cc;
  box-shadow: 0 4px 16px rgba(0, 102, 204, 0.25);
  transform: translateY(-2px);
}
</style>