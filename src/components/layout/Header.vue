<template>
  <header class="app-header">
    <!-- Logo 区域 -->
    <div class="header-logo">
      <span class="sys-name">智能调压箱</span>
      <span class="separator">·</span>
      <span class="company-name">北京北燃环能科技发展有限公司</span>
    </div>
    
    <!-- 右侧可选：用户信息、设置等 -->
    <div class="header-actions">
      <img src="@/assets/images/logo_title.png" alt="公司Logo" class="logo-img" />
      <img src="@/assets/images/logo_2.png" alt="公司Logo" class="logo-img2" />
      <!--
      <button class="header-btn">设置</button>
      <button class="header-btn">退出</button>
      -->
    </div>
  </header>
</template>

<script setup lang="ts">
// 可添加 Logo 点击事件、用户信息获取等逻辑
</script>

<style scoped>
.app-header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #a81414;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 410px;
  height: 60px;
}

.logo-img2{
  width: 156px;
  height: 60px;
}

.sys-name {
  font-size: 18px;
  font-weight: bold;
  color: #0066cc;
}

.separator {
  font-size: 18px;
  font-weight: bold;
  color: #3f3a3a;
  opacity: 0.5;
}
.company-name {
  font-size: 18px;
  font-weight: bold;
  color: #201a1a;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.header-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
</style>