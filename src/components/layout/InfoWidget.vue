<template>
  <aside class="info-panel" :class="{ hidden: !visible }">
      <h2 class="info-title" id="infoTitle">{{ title }}</h2>
      <div class="info-body" id="infoBody" v-html="body"></div>
      <!--<div class="info-image" id="infoImage">
        <img v-if="image" :src="image" alt=""> 
         <span class="image-placeholder">图片占位</span>
      </div> -->
    </aside>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  body: string
  image?: string
  visible?: boolean // 如果需要隐藏面板
}>()
</script>

<style scoped>
.info-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 320px;
  max-height: 45vh;
  padding: 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 12px;
  border: 1px solid rgba(0, 102, 204, 0.2);;
  box-shadow: 0 8px 32px rgba(0, 102, 204, 0.12);
  z-index: 15;
  transition: opacity 0.35s ease;
}


.info-panel.hidden {
  opacity: 0;
  pointer-events: none;
}

.info-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 12px;
  line-height: 1.4;
}

:deep(.info-body b) {
  font-size: 15px;
  font-weight: 700;
  color: #0519cf; /* 想更显眼可以改色 */
  display: inline-block;
  margin-bottom: 4px;
}

.info-body {
  font-size: 18px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: 16px;
  white-space: normal;
  word-break: break-all;
}

.info-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: rgba(0, 102, 204, 0.06);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>