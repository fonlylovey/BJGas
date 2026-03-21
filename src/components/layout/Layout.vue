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
        :visible="true"
        />
      </div>
      <AppFooter />
    </div>

    <div>
      <button class="contact-btn" id="contactBtn" title="联系我们">联系我们</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppHeader from './Header.vue';
import LeftSlideBar from './LeftSlideBar.vue';
import AppFooter from './Footer.vue';
import Viewer from '@/views/threeView/Viewer.vue';
import InfoWidget from './InfoWidget.vue'
import { SEGMENTSData } from '@/data/segments' // 导入数据

// 弹窗显示状态（可抽离到 Pinia/Vuex 全局管理）
const modalVisible = ref(false);
const activeSegment = ref(0)
const currentInfo  = computed(() => SEGMENTSData[activeSegment.value]);

const handleSegmentSelected = (index: number) => {
  activeSegment.value = index;
  console.log("收到发射消息");
}

</script>

<style scoped>
/* 根容器：相对定位，铺满全屏 */
.app-layout {
  position: relative; /* 作为子元素绝对定位的参考 */
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* 防止滚动条 */
  font-family: 'Noto Sans SC', -apple-system, sans-serif;
}

/* Viewer 容器：绝对定位铺满全屏，作为底层 */
.viewer-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 最低层级 */
}

.layout-overlay {
  position: relative;
  z-index: 10; 
  height: 100%;
  pointer-events: none; 
  border: 10px;
  padding: 10px;
  margin: 10px;
}

.layout-overlay > * {
  pointer-events: auto;
}

.layout-overlay .app-header {
  height: 60px;
  background-color: rgba(255, 255, 255, 0); /* 半透明背景 */
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.layout-infoWidget{
  width: 50%;
}

.layout-main {
  display: flex;
  width: 160px;
  height: calc(100% - 60px - 80px); /* 扣除 Header + Footer 高度 */
  padding-top: 8px;
}


.layout-overlay .modal {
  z-index: 100; /* 确保弹窗在最上层 */
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
  background: rgba(255, 255, 255, 0.85);;
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
</style>