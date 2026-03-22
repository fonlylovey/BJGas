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

      <!-- 第三组按钮 -->
      <div class="control-group">
        <button class="control-btn" @click="onBoxStyle(1)">围栏样式1</button>
        <button class="control-btn" @click="onBoxStyle(2)">围栏样式2</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import * as ViewpointControl from '@/three3D/ViewpointControl'
import { modelDB } from '@/three3D/ModelDB';
import { compile, ref } from 'vue';
import * as THREE from 'three';
import { Three3DInstance } from '@/three3D/Three3D';

const boxVisible = ref(true);        // 外箱是否可见
const boxTransparent = ref(false);   // 外箱是否透明
let currentBox = modelDB.modelLsit[0];

function zoomIn(){
  ViewpointControl.zoomIn();
}

function zoomOut(){
  ViewpointControl.zoomOut();
}

// 切换外箱可见性
function toggleBoxVisibility() {
  if (!modelDB.modelObj && !currentBox) return;

  const newVisibility = !boxVisible.value;
  /*
  modelDB.modelObj.children.forEach(item => {
    if (item.name === '调压箱01') {
      item.visible = newVisibility;
    }
  });*/
  currentBox.visible = newVisibility;
  boxVisible.value = newVisibility;
}

// 切换外箱透明状态
function toggleBoxTransparency() {
  if (!modelDB.modelObj || !boxVisible.value) return;

  const newTransparent = !boxTransparent.value;
   
  if (currentBox &&  currentBox instanceof THREE.Mesh ) {
       // 处理单个材质或材质数组
        const materials = Array.isArray(currentBox.material) 
          ? currentBox.material 
          : [currentBox.material];
        materials.forEach((mat) => {
          mat.transparent = newTransparent;
          mat.opacity = newTransparent ? 0.35 : 1.0;
          mat.depthWrite = !newTransparent; //
          mat.depthTest = !newTransparent; 
          mat.needsUpdate = true;
        });
    }
  boxTransparent.value = newTransparent;
}

const onBoxStyle = (index: number) => {
  /*
  const cameraData = Three3DInstance.getCameraPosition();
  if (cameraData) {
      console.log('相机位置:', cameraData.position);
      console.log('目标点:', cameraData.target);
  }*/
 modelDB.modelLsit.forEach(item =>{
  console.log("模型组件列表：", item.name);
 });
 if(index == 1){
  if (!modelDB.modelObj) return;
    modelDB.modelObj.children.forEach(item => {
      if (item.name === '箱体_箱子01') {
        item.visible = true;
        currentBox = item;
      }
    });
    modelDB.modelLsit[0].visible = false;
 } else if(index == 2) {
    if (!modelDB.modelObj) return;
      modelDB.modelObj.children.forEach(item => {
        if (item.name === '箱体_箱子01') {
          item.visible = false;
        }
      });
      modelDB.modelLsit[0].visible = true;
      currentBox = modelDB.modelLsit[0];
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
  align-items: center; /* 🔥 让分隔符垂直居中 */
  gap: 20px; /* 组之间的间距 */
}

.control-group {
  display: flex;
  gap: 9px; /* 组内按钮间距 */
}

/* 🔥 分隔符样式 */
.separator {
  width: 1px;
  height: 30px;
  background-color: #47494c; /* 浅灰色，很柔和 */
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
</style>