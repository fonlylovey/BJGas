<template>
  <footer class="app-footer">
    <div class="footer-controls">
      <!-- 第一组按钮 -->
      <div class="control-group">
        <button id="zoomInBtn"  class="control-btn-circle" v-on:click="zoomIn">＋</button>
        <button id="zoomOutBtn" class="control-btn-circle" v-on:click="zoomOut">－</button>
      </div>

      <!-- 分隔符 1 -->
      <div class="separator"></div>

      <!-- 第二组按钮 -->
      <div class="control-group">
        <button id="outerBoxToggleBtn"  class="control-btn" @click="toggleBoxVisibility">
          {{ boxVisible ? '外箱隐藏' : '外箱显示' }}
        </button>
        <button id="outerBoxTransparentBtn" class="control-btn" @click="toggleBoxTransparency">
          {{ boxTransparent ? '外箱实体' : '外箱透明' }}
        </button>
      </div>

      <!-- 分隔符 2 -->
      <div class="separator"></div>

      <!-- 第三组按钮 → 增加选中样式 -->
      <div class="control-group">
        <button 
          class="control-btn" 
          :class="{ checked: Style1Checked }" 
          @click="onBoxStyle1()"
        >
          围栏样式1
        </button>
        <button 
          class="control-btn" 
          :class="{ checked: Style2Checked }" 
          @click="onBoxStyle2()"
        >
          围栏样式2
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import * as ViewpointControl from '@/three3D/ViewpointControl'
import { modelDB } from '@/three3D/ModelDB';
import { ref } from 'vue';
import * as THREE from 'three';
import { Three3DInstance } from '@/three3D/Three3D';

const boxVisible = ref(true);        // 外箱是否可见
const boxTransparent = ref(false);   // 外箱是否透明
const Style1Checked = ref(false);
const Style2Checked = ref(false);

function zoomIn(){
  ViewpointControl.zoomIn();
}

function zoomOut(){
  ViewpointControl.zoomOut();
}

// 切换外箱可见性
function toggleBoxVisibility() {
  const newVisibility = !boxVisible.value;
  modelDB.modelLsit.get("tyx_box")!.visible = newVisibility;
  boxVisible.value = newVisibility;
  console.log(modelDB.modelLsit.get("tyx_box"), newVisibility);
}

// 切换外箱透明状态
function toggleBoxTransparency() {
  const newTransparent = !boxTransparent.value;
  let currentBox = null;
  currentBox = modelDB.modelLsit.get("tyx_box");
  
  if (currentBox) {
    currentBox.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) 
          ? child.material 
          : [child.material];
        materials.forEach((mat) => {
          mat.transparent = newTransparent;
          mat.opacity = newTransparent ? 0.35 : 1.0;
          mat.depthWrite = !newTransparent;
          mat.depthTest = !newTransparent; 
          mat.needsUpdate = true;
        });
      }
    });
  }
  boxTransparent.value = newTransparent;
}

// 切换围栏样式
const onBoxStyle1 = () => {
  Style1Checked.value = !Style1Checked.value;
  Style2Checked.value = false;
  modelDB.modelLsit.get("tyx_fence_2")!.visible = false;
  if(Style1Checked.value){
    modelDB.modelLsit.get("tyx_fence_1")!.visible = true;
  }
  else{
    modelDB.modelLsit.get("tyx_fence_1")!.visible = false;
  }
  
};

const onBoxStyle2 = () => {
  const cameraData = Three3DInstance.getCameraPosition();
  if (cameraData) {
      console.log('相机位置:', cameraData.position);
      console.log('目标点:', cameraData.target);
  }
  Style2Checked.value = !Style2Checked.value;
  Style1Checked.value = false;
  modelDB.modelLsit.get("tyx_fence_1")!.visible = false;
  if(Style2Checked.value){
    modelDB.modelLsit.get("tyx_fence_2")!.visible = true;
  }
  else{
    modelDB.modelLsit.get("tyx_fence_2")!.visible = false;
  }
  
};
</script>

<style scoped>
.app-footer {
  height: 80px;
  background-color: #ffffff00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.control-group {
  display: flex;
  gap: 9px;
}

.separator {
  width: 1px;
  height: 30px;
  background-color: #47494c;
}

.control-btn-circle {
  width: 40px;
  height: 40px;
  padding: 8px 8px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn-circle:hover {
  background-color: #f5f5f5;
  border-color: #1890ff;
  color: #1890ff;
}

.control-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 30px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background-color: #f5f5f5;
  border-color: #1890ff;
  color: #1890ff;
}

/* 🔥 你要的选中样式：蓝色边框 + 蓝色文字 + 半透明蓝色背景 */
.control-btn.checked {
  border-color: #1890ff;
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.15);
}
</style>