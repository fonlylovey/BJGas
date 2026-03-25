<template>
  <teleport to="body">
    <div v-if="visible" class="modal-mask" @click.self="handleClose">
      <div class="modal-container">
        <!-- 弹窗头部 -->
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="handleClose">×</button>
        </div>
        <!-- 弹窗内容 -->
        <div class="modal-body">
          <!-- 默认插槽内容，如果没有传入内容则显示默认联系表单 -->
          <slot>
            <div class="contact-info">
              <p><strong>北京北燃环能科技发展有限公司</strong></p>
              <p>联系人：王浩</p>
              <p>电话：18311335876</p>
            </div>
            <div class="contact-qrcode">
              <img src="@/assets/images/wechart.png"  />
            </div>
          </slot>
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
  animation: fadeIn 0.3s ease;
}

.modal-container {
  width: 500px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  min-height: 200px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 联系信息样式 */
.contact-info {
  margin-bottom: 24px;
}

.contact-info p {
  margin: 12px 0;
  line-height: 1.6;
  color: #333;
  font-size: 14px;
}

.contact-info p strong {
  color: #667eea;
  font-size: 16px;
}

.contact-qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.qrcode-placeholder {
  display: inline-block;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  text-align: center;
  border: 1px dashed #ddd;
  transition: all 0.3s ease;
}

.qrcode-placeholder:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #eef2ff 0%, #e9ecef 100%);
  transform: scale(1.02);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fafafa;
}

.modal-btn {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #ddd;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modal-btn:hover {
  transform: translateY(-1px);
}

.modal-btn:active {
  transform: translateY(0);
}

.cancel {
  background-color: #fff;
  color: #666;
  border-color: #ddd;
}

.cancel:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
  color: #333;
}

.confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.confirm:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}
</style>