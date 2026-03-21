<template>
  <aside class="app-sidebar">
   <nav class="nav-pills" id="navPills">
      <span class="button-wrapper"><button class="button" data-segment="0" @click="onClicked(0)">设备总览</button></span>
      <span class="button-wrapper"><button class="button" data-segment="1" @click="onClicked(1)">基础监测</button></span>
      <span class="button-wrapper"><button class="button" data-segment="2" @click="onClicked(2)">远程调控</button></span>
      <span class="button-wrapper"><button class="button" data-segment="3" @click="onClicked(3)">在线诊断</button></span>
      <span class="button-wrapper"><button class="button" data-segment="4" @click="onClicked(4)">供电保障</button></span>
      <span class="button-wrapper"><button class="button" data-segment="5" @click="onClicked(5)">扩展安全</button></span>
      <span class="button-wrapper"><button class="button button-model" data-segment="8" @click="onClicked(6)">自驱电源</button></span>
      <span class="button-wrapper"><button class="button button-model" data-segment="7" @click="onClicked(7)">智能调压器</button></span>
      <button class="pill pill-auto" id="autoPlayBtn" title="点击恢复自动播放">
        <span class="auto-icon">◐</span> 自动播放
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import ContactButton from '../common/ContactButton.vue';
import { SEGMENTSData } from '@/data/segments' // 导入数据
import { Three3DInstance } from '@/three3D/Three3D';
import * as THREE from 'three';

const emit = defineEmits<{
  (e: 'segment-selected', index: number): void
}>()

const onClicked = (index: number) => {
  emit('segment-selected', index);
  const segment = SEGMENTSData[index];
  Three3DInstance.animateCameraTo(new THREE.Vector3(segment.camera.pos[0], segment.camera.pos[1], segment.camera.pos[2]),
  new THREE.Vector3(segment.camera.target[0], segment.camera.target[0], segment.camera.target[0]))
}

</script>

<style scoped>
.app-sidebar {
 position: fixed;
  left: 24px;
  top: 40%;
  width:130px;
  height: 500px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 20;
  
}

.button-wrapper {
  position: relative;
  display: inline-block;
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
  margin-top: 10px;
}

.button:hover {
  color: #0066cc;
  background: rgba(0, 102, 204, 0.1);
  box-shadow:  0 2px 16px rgba(0, 102, 204, 0.2);
}

.button.active {
  color: rgba(0, 102, 204, 0.1);
  background: rgba(0, 102, 204, 0.15);
  box-shadow:  0 2px 16px rgba(0, 102, 204, 0.2);
}

.button-model {
  margin-top: 8px;
}

.button-auto {
  margin-top: 16px;
  border: 1px solid vrgba(0, 102, 204, 0.2);;
}

.sidebar-contact {
  padding: 0 16px;
  margin-top: auto;
}

.pill-auto {
  width: 220px;
  height: 64px;
  border-radius: 40px;
  margin-top: 16px;
  border: 1px solid rgba(0, 102, 204, 0.2);
}

.pill-auto.playing {
  color: #00a86b;
  border-color: rgba(0, 168, 107, 0.4);
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { box-shadow: 0 2px 12px rgba(0, 168, 107, 0.2); }
  50% { box-shadow: 0 4px 20px rgba(0, 168, 107, 0.35); }
}

.auto-icon {
  display: inline-block;
  margin-right: 4px;
}

</style>