<template>
  <button class="contact-btn" @click="showContactModal">
    📞 联系我们
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const contactModalVisible = ref(false);
const showContactModal = () => {
  contactModalVisible.value = true;
};
</script>

<style scoped>
.contact-btn {
  width: 220px;
  height: 64px;
  padding: 12px 16px;
  border-radius: 6px;
  background-color: #1890ff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-btn:hover {
  background-color: #096dd9;
}
</style>