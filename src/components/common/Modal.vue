<template>
  <teleport to="body">
    <div v-if="visible" class="modal-mask">
      <div class="modal-container">
        <!-- 弹窗头部 -->
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="handleClose">×</button>
        </div>
        <!-- 弹窗内容 -->
        <div class="modal-body">
          <slot />
        </div>
        <!-- 弹窗底部 -->
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="handleClose">取消</button>
          <button class="modal-btn confirm" @click="handleConfirm">确认</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">

// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '提示',
  },
});

// 定义事件
const emit = defineEmits(['update:visible', 'confirm', 'close']);

const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};

const handleConfirm = () => {
  emit('update:visible', false);
  emit('confirm');
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  width: 500px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  min-height: 100px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.cancel {
  background-color: #fff;
}

.confirm {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
</style>