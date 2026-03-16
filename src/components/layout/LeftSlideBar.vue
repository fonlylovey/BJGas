<template>
  <aside class="app-sidebar">
   <nav class="nav-pills" id="navPills">
      <span class="button-wrapper"><button class="button" data-segment="0">开场总览</button></span>
      <span class="button-wrapper"><button class="button" data-segment="1">基础监测</button></span>
      <span class="button-wrapper"><button class="button" data-segment="2">远程调控</button></span>
      <span class="button-wrapper"><button class="button" data-segment="3">在线诊断</button></span>
      <span class="button-wrapper"><button class="button" data-segment="4">供电保障</button></span>
      <span class="button-wrapper"><button class="button" data-segment="5">扩展安全</button></span>
      <span class="button-wrapper"><button class="button" data-segment="6">结尾总结</button></span>
      <span class="button-wrapper"><button class="button button-model" data-segment="7">智能调压器</button></span>
      <span class="button-wrapper"><button class="button button-model" data-segment="8">自发电模块</button></span>
      
    </nav>
  </aside>
</template>

<script setup lang="ts">
import ContactButton from '../common/ContactButton.vue';

</script>

<style scoped>
.app-sidebar {
 position: fixed;
  left: 24px;
  top: 50%;
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
  width: 130px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #4a5f7a;
  font-size: 14px;
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
</style>