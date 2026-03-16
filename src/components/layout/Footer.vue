<template>
  <footer class="app-footer">
    <div class="footer-controls">
      <!-- 第一组按钮 -->
      <div class="control-group">
        <button class="control-btn" v-for="btn in group1" :key="btn">{{ btn }}</button>
      </div>
      <!-- 第二组按钮 -->
      <div class="control-group">
        <button class="control-btn" v-for="btn in group2" :key="btn">{{ btn }}</button>
      </div>
      <!-- 第三组按钮 -->
      <div class="control-group">
        <button class="control-btn" v-for="btn in group3" :key="btn">{{ btn }}</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 底部控制按钮分组（按你的业务命名）
const group1 = ['旋转', '缩放', '平移']; // 第一组3个
const group2 = ['重置', '全屏', '截图']; // 第二组3个
const group3 = ['保存', '导入', '导出']; // 第三组3个
</script>

<style scoped>
.app-footer {
  height: 80px;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-controls {
  display: flex;
  gap: 40px; /* 组之间的间距 */
}

.control-group {
  display: flex;
  gap: 16px; /* 组内按钮间距 */
}

.control-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
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