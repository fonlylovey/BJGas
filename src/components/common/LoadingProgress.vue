<template>
  <div v-if="visible" class="loading-container">
    <!-- 白色大盒子：内部包含 进度条 + 百分比 + 底部文字 -->
    <div class="progress-box">
      <!-- 上半部分：进度条 + 百分比 -->
      <div class="progress-row">
        <div class="progress-bar">
          <div class="progress-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="percent">{{ progress }}%</div>
      </div>

      <!-- 下半部分：进度文本（也在白色盒子里） -->
      <div class="tip-text">{{ tipText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'

const progress = ref(0)
const visible = ref(false)
const tipText = ref('模型加载中，请稍候...')
const progressBar = document.getElementById('progressBar');
const show = () => {
  visible.value = true
  progress.value = 0
}

const updateProgress = (percent: number) => {
  progress.value = Math.round(percent);
}

const updateProgressInfo = (text: string) => {
  tipText.value = text;
}

const hide = () => {
  visible.value = false
}

defineExpose({ show, updateProgress, hide, updateProgressInfo })
</script>

<style scoped>
/* 全屏居中 */
.loading-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

/* 白色圆角盒子 650*80 */
.progress-box {
  width: 650px;
  height: 80px;
  background: #fff;
  border-radius: 16px;
  padding: 10px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

/* 进度条行 */
.progress-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 进度条背景 */
.progress-bar {
  flex: 1;
  height: 28px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}

/* 蓝色进度条 */
.progress-inner {
  height: 100%;
  background: #2f80ed;
  transition: width;
}

/* 百分比 */
.percent {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  min-width: 60px;
  text-align: center;
}

/* 底部提示文字（在白色盒子内部） */
.tip-text {
  font-size: 14px;
  color: #666;
  text-align: center;
}
</style>