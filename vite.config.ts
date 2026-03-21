import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    }
  },
  server: {
    proxy: {
      '/models': {
        target: 'http://162.14.121.202:80', // 目标服务器
        changeOrigin: true, // 🔥 关键：开启跨域
        rewrite: (path) => path.replace(/^\/models/, '')
      }
    }
  },
  optimizeDeps: {
    exclude: ['three']
  }
  
});