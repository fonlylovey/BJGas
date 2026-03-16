import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../components/layout/Layout.vue';
import ThreeViewer from '../views/threeView/Viewer.vue';

// 示例：其他模块页面（你需要自己创建）
//const Module1Page = () => import('@/views/module1/Module1Page.vue');
//const Module2Page = () => import('@/views/module2/Module2Page.vue');

const routes = [
  {
    path: '/',
    component: Layout, // 根路由使用全局布局
    redirect: '/three-view', // 默认跳转到 3D 可视化页面
    children: [
      { path: 'three-view', component: ThreeViewer, name: 'ThreeView' },
      //{ path: 'module1', component: Module1Page, name: 'Module1' },
      //{ path: 'module2', component: Module2Page, name: 'Module2' },
      // 补充其他模块路由
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;