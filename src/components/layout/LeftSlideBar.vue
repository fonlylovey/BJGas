<template>
  <aside class="app-sidebar">
    <nav class="nav-pills" :class="{ 'auto-playing': isAutoPlaying }">
      <span 
        v-for="(item, idx) in buttons" 
        :key="idx"
        class="pill-wrapper"
        :class="{ 'active': isAutoPlaying && currentAutoIndex === idx }"
        :style="{
          '--segment-progress': getProgress(idx),
          '--border-duration': `${borderDuration}ms`
        }"
      >
        <button 
          class="button" 
          :data-segment="idx" 
          @click="onClicked(idx)"
        >
          {{ item.label }}
        </button>
      </span>
      <div class="auto-play-control">
        <button 
          class="pill pill-auto" 
          :class="{ playing: isAutoPlaying }"
          @click.stop="toggleAutoPlay"
        >
          <span class="auto-icon">◐</span> 自动播放
        </button>

      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { SEGMENTSData } from '@/data/segments';
import { Three3DInstance } from '@/three3D/Three3D';
import * as THREE from 'three';
import { modelDB } from '@/three3D/ModelDB';

// 按钮列表配置
const buttons = ref([
  { label: '设备总览', segmentIndex: 0 },
  { label: '基础监测', segmentIndex: 1 },
  { label: '远程调控', segmentIndex: 2 },
  { label: '在线诊断', segmentIndex: 3 },
  { label: '供电保障', segmentIndex: 4 },
  { label: '扩展安全', segmentIndex: 5 },
  { label: '自驱电源', segmentIndex: 6 },
  { label: '智能调压器', segmentIndex: 7 }
]);

const emit = defineEmits<{
  (e: 'segment-selected', index: number): void
}>()

// 自动播放相关状态
const isAutoPlaying = ref(false);
const currentAutoIndex = ref(0);
const progressPercent = ref(0); // 当前进度 0-1
const borderDuration = ref(5000); // 边框动画持续时间（毫秒），默认5000ms
let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
let progressTimer: ReturnType<typeof setInterval> | null = null;
let animationStartTime = 0;

// 空闲计时相关
const IDLE_TIME = 20000; // 20秒无操作自动播放
let idleTimer: ReturnType<typeof setTimeout> | null = null;

// 重置空闲计时器
const resetIdleTimer = () => {
  // 如果已经在自动播放状态，不需要重置计时器
  if (isAutoPlaying.value) return;
  
  // 清除现有的计时器
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
  
  // 设置新的计时器
  idleTimer = setTimeout(() => {
    console.log('页面20秒无操作，自动开始播放');
    startAutoPlay();
  }, IDLE_TIME);
};

// 监听用户操作
const onUserActivity = () => {
  // 只有在非自动播放状态时才重置计时器
  if (!isAutoPlaying.value) {
    resetIdleTimer();
  }
};

// 获取当前按钮的进度值（只有当前播放的按钮才显示进度）
const getProgress = (idx: number) => {
  if (!isAutoPlaying.value || idx !== currentAutoIndex.value) return 0;
  return progressPercent.value;
}

// 更新进度
const updateProgress = () => {
  const update = () => {
    const now = Date.now();
    const elapsed = now - animationStartTime;
    
    if (elapsed >= borderDuration.value) {
      progressPercent.value = 1;
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
    } else {
      progressPercent.value = elapsed / borderDuration.value;
    }
  };
  
  update();
  progressTimer = setInterval(update, 16); // 约60fps
}

// 点击功能按钮的逻辑
const onClicked = (index: number) => {
  // 记录用户操作
  onUserActivity();
  
  // 如果正在自动播放，先停止
  if (isAutoPlaying.value) {
    stopAutoPlay();
  }
  
  // 更新当前选中的索引
  currentAutoIndex.value = index;
  
  // 触发选中事件
  emit('segment-selected', index);
  
  // 切换到对应的相机视角
  const segment = SEGMENTSData[index];
  Three3DInstance.animateCameraTo(
    new THREE.Vector3(segment.camera.pos[0], segment.camera.pos[1], segment.camera.pos[2]),
    new THREE.Vector3(segment.camera.target[0], segment.camera.target[1], segment.camera.target[2])
  );

  if (index == 7) {
    modelDB.modelLsit.forEach((value, key) => {
      value.visible = false;
    });
    modelDB.modelLsit.get("tyx_znbyq")!.visible = true;
    modelDB.modelLsit.get("tyx_znbyq")!.traverse((child) => {
      child.visible = true;
    });
    console.log("tyx_znbyq", modelDB.modelLsit.get("tyx_znbyq"));
    
  }
}

// 切换到下一个按钮
const nextButton = () => {
  // 清除进度计时器
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  
  const nextIndex = (currentAutoIndex.value + 1) % buttons.value.length;
  currentAutoIndex.value = nextIndex;
  progressPercent.value = 0;
  animationStartTime = Date.now();
  
  // 开始新的进度动画
  updateProgress();
  
  // 触发选中事件
  emit('segment-selected', nextIndex);
  const segment = SEGMENTSData[nextIndex];
  Three3DInstance.animateCameraTo(
    new THREE.Vector3(segment.camera.pos[0], segment.camera.pos[1], segment.camera.pos[2]),
    new THREE.Vector3(segment.camera.target[0], segment.camera.target[1], segment.camera.target[2])
  );
}

// 开始自动播放
const startAutoPlay = () => {
  // 清除空闲计时器
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
  
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
  }
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  
  isAutoPlaying.value = true;
  progressPercent.value = 0;
  animationStartTime = Date.now();
  
  // 开始第一个按钮的进度动画
  updateProgress();
  
  // 设置轮播间隔 = 边框动画时间
  autoPlayTimer = setInterval(() => {
    nextButton();
  }, borderDuration.value);
  setModelComponentVisibility("调压箱01", false);
}

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  isAutoPlaying.value = false;
  currentAutoIndex.value = -1;
  progressPercent.value = 0;
  setModelComponentVisibility("调压箱01", true);
  
  // 停止自动播放后，重新启动空闲计时器
  resetIdleTimer();
}

// 切换自动播放状态
const toggleAutoPlay = () => {
  // 记录用户操作
  onUserActivity();
  
  if (isAutoPlaying.value) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

// 监听点击外部区域停止播放
const handleGlobalClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // 记录用户操作
  onUserActivity();
  
  // 如果点击的不是自动播放按钮、速度控制区域和按钮区域，且正在播放，则停止
  if (isAutoPlaying.value && 
      !target.closest('.pill-auto') && 
      !target.closest('.speed-control') &&
      !target.closest('.pill-wrapper')) {
    stopAutoPlay();
  }
}

// 监听页面滚动
const handleScroll = () => {
  onUserActivity();
}

// 监听键盘事件
const handleKeyPress = () => {
  onUserActivity();
}

// 监听鼠标移动
const handleMouseMove = () => {
  onUserActivity();
}

// 监听 borderDuration 变化，更新轮播间隔
watch(borderDuration, (newDuration) => {
  if (isAutoPlaying.value && autoPlayTimer) {
    // 重新设置定时器
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      nextButton();
    }, newDuration);
  }
});

// 监听页面点击事件
onMounted(() => {
  // 添加各种用户活动监听
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('scroll', handleScroll);
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('mousemove', handleMouseMove);
  
  // 启动空闲计时器
  resetIdleTimer();
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
  document.removeEventListener('scroll', handleScroll);
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('mousemove', handleMouseMove);
  
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
  }
  if (progressTimer) {
    clearInterval(progressTimer);
  }
  if (idleTimer) {
    clearTimeout(idleTimer);
  }
});

// 切换外箱可见性
function setModelComponentVisibility(name: string, visible: boolean) {
  if (!modelDB.modelObj) return;
  modelDB.modelObj.children.forEach(item => {
    if (item.name === name) {
      item.visible = visible;
    }
  });
}

// 切换外箱透明状态
function setModelComponentTransparency(name: string, visible: boolean) {
  if (!modelDB.modelObj) return;
   
  // 遍历找到外箱物体，修改其材质的透明度
  modelDB.modelObj.children.forEach(item => {
    if (item.name === name && item instanceof THREE.Mesh ) {
       // 处理单个材质或材质数组
        const materials = Array.isArray(item.material) 
          ? item.material 
          : [item.material];
        materials.forEach((mat) => {
          mat.transparent = visible;
          mat.opacity = visible ? 0.35 : 1.0;
          mat.depthWrite = !visible; //
          mat.depthTest = !visible; 
          mat.needsUpdate = true;
        });
    }
  });
}

</script>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 24px;
  top: 50%;
  width: 130px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 20;
}

.nav-pills {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pill-wrapper {
  position: relative;
  display: inline-block;
}

/* 自动播放时，当前段落的跑马灯进度环 - 精确匹配按钮边框 */
.nav-pills.auto-playing .pill-wrapper.active::before {
  width: 220px;
  height: 64px;
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 40px;
  padding: 2px;
  background: conic-gradient(
    from -90deg,
    #0066cc calc(var(--segment-progress, 0) * 360deg),
    rgba(0, 102, 204, 0.25) 0
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  transition: background 0.016s linear;
}

/* 当前激活按钮的样式增强 */
.nav-pills.auto-playing .pill-wrapper.active .button {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 102, 204, 0.3);
  box-shadow: 0 2px 12px rgba(0, 102, 204, 0.2);
}

.button {
  display: block;
  width: 220px;
  height: 64px;
  padding: 10px 18px;
  border: none;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.85);
  color: #4a5f7a;
  font-size: 24px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.35s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.button:hover {
  color: #0066cc;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 16px rgba(0, 102, 204, 0.2);
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(1px);
}

.button-model {
  margin-top: 8px;
}

.auto-play-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.pill-auto {
  width: 220px;
  height: 64px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 102, 204, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24px;
  font-family: inherit;
  color: #4a5f7a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.pill-auto:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 102, 204, 0.4);
  transform: translateY(-1px);
}

/* 自动播放按钮播放状态 */
.pill-auto.playing {
  color: #00a86b;
  border-color: #00a86b;
  background: rgba(255, 255, 255, 0.85);
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { 
    box-shadow: 0 2px 12px rgba(0, 168, 107, 0.2);
  }
  50% { 
    box-shadow: 0 4px 20px rgba(0, 168, 107, 0.35);
  }
}

.auto-icon {
  display: inline-block;
  margin-right: 4px;
  font-size: 20px;
}

/* 速度控制滑块样式 */
.speed-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 220px;
  box-sizing: border-box;
}

.speed-label {
  font-size: 14px;
  color: #4a5f7a;
  font-weight: 500;
}

.speed-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: #e0e4e8;
  border-radius: 2px;
  outline: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0066cc;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.speed-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.speed-value {
  font-size: 12px;
  color: #0066cc;
  font-weight: 500;
  min-width: 45px;
  text-align: right;
}
</style>