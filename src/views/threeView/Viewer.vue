<template>
  <!-- 必须只有一个根节点！！ -->
  <div class="viewer-wrapper">

    <!-- 3D场景 -->
    <div class="three-viewer">
      <div ref="containerRef" class="three-container" @click="onMouseLeftClicked"></div>
    </div>

    <!-- 标签层 -->
    <div id="labels-overlay" class="labels-overlay">
      <svg id="callout-lines" class="callout-lines"></svg>
      <div id="labels-container" class="labels-container"></div>
    </div>

    <!-- 进度条（放在最后，层级最高） -->
    <LoadingProgress ref="loadingRef" />
  </div>
</template>

<script setup lang="ts">
import { Three3DInstance } from '@/three3D/Three3D';
import { ref, onMounted, onUnmounted } from 'vue';
import { modelDB } from '@/three3D/ModelDB';
import LoadingProgress from '@/components/common/LoadingProgress.vue'

const containerRef = ref<HTMLDivElement | null>(null);
const loadingRef = ref<any>(null);

const modelUrl1 = new URL('@/assets/Models/TYX/tyx_body.fbx', import.meta.url).href;
const modelUrl2 = new URL('@/assets/Models/TYX/tyx_box.fbx', import.meta.url).href;
const modelUrl3 = new URL('@/assets/Models/TYX/tyx_znbyq.fbx', import.meta.url).href;
const modelUrl4 = new URL('@/assets/Models/TYX/tyx_fence_1.fbx', import.meta.url).href;
const modelUrl5 = new URL('@/assets/Models/TYX/tyx_fence_2.fbx', import.meta.url).href;

const initScene = async () => {
  //加载调压箱主体
  /*
  try {
    // 显示进度条
    loadingRef.value?.show();
    const model = await modelDB.loadFBXModel(modelUrl1, (percent, info) => {
      loadingRef.value?.updateProgress(percent);
      loadingRef.value?.updateProgressInfo(info);
    });
    
    loadingRef.value?.hide();
    Three3DInstance.addObject(model);
    modelDB.modelObj = model;
  } catch (error) {
    loadingRef.value?.hide();
    console.error('加载失败', error);
  }*/
  //加载调压器外箱
  try {
    const model = await modelDB.loadFBXModel(modelUrl2);
    model.visible = true;
    model.layers.set(1);
    Three3DInstance.addObject(model);
    modelDB.modelLsit.set("tyq_box", model);
  } catch (error) {
  }

  //加载第一个围栏
  try {
    const model = await modelDB.loadFBXModel(modelUrl4);
    model.visible = true;
    Three3DInstance.addObject(model);
    modelDB.modelLsit.set("tyx_fence_1", model);
  } catch (error) {
  }
  //加载第二个围栏
  try {
    const model = await modelDB.loadFBXModel(modelUrl5);
    model.scale.set(0.01, 0.01, 0.01);
    model.visible = false;
    Three3DInstance.addObject(model);
    modelDB.modelLsit.set("tyx_fence_2", model);
  } catch (error) {
  }

  //加载智能变压器
  try {
    const model = await modelDB.loadFBXModel(modelUrl3);
    model.visible = false;
    Three3DInstance.addObject(model);
    modelDB.modelLsit.set("tyx_znbyq", model);
  } catch (error) {
  }
};

const handleResize = () => {
  if (!containerRef.value || !Three3DInstance.camera || !Three3DInstance.renderer) return;
  Three3DInstance.camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
  Three3DInstance.camera.updateProjectionMatrix();
  Three3DInstance.renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
};

const onMouseLeftClicked = (event: MouseEvent) => {
  const clickedObject = Three3DInstance.onMouseClick(event);
  if (clickedObject) {
    if (clickedObject.type === 'Mesh') {
      Three3DInstance.highLightObject(clickedObject);
    } else {
      Three3DInstance.currentSelected && Three3DInstance.unhighlightObject(Three3DInstance.currentSelected);
    }
  } else {
    Three3DInstance.currentSelected && Three3DInstance.unhighlightObject(Three3DInstance.currentSelected);
  }
};

onMounted(() => {
  if (containerRef.value) {
    Three3DInstance.init(containerRef.value);

    // 加载模型（内部会显示进度条）
    initScene();
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('dblclick', onMouseLeftClicked);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Three3DInstance.destroy();
});

</script>

<style scoped>
/* 根容器 */
.viewer-wrapper {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* 3D容器 */
.three-viewer {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1; /* 不要用9999 */
}

.three-container {
  width: 100%;
  height: 100%;
}

.labels-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.callout-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

@keyframes dash-flow {
  to {
    stroke-dashoffset: -7;
  }
}

.callout-lines line {
  stroke: #0066cc;
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
  animation: dash-flow 1.5s linear infinite;
}

.labels-container {
  position: absolute;
  inset: 0;
}
</style>