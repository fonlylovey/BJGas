<template>
  <div class="three-viewer">
    <div ref="container" class="three-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Three.js 容器
const container = ref<HTMLDivElement | null>(null);

// Three.js 核心对象
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let controls: OrbitControls;

// 初始化 Three.js
const initThree = () => {
  if (!container.value) return;

  // 1. 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe8f2fc);

  // 2. 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 3. 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // 4. 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.3, 0); // 围绕模型中心旋转
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 2;
  controls.maxDistance = 12;

  // 5. 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 6. 坐标轴辅助线
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const floorGeom = new THREE.PlaneGeometry(20, 20);
  const floorMat = new THREE.MeshStandardMaterial({
  color: 0xd8e4f0,
  roughness: 0.9,
  metalness: 0,
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.5;
  floor.receiveShadow = true;
  scene.add(floor);
  // 地面网格线
  const gridHelper = new THREE.GridHelper(20, 20, 0xb8c8d8, 0xc8d4e0);
  gridHelper.position.y = -0.48;

  function animate() {
      requestAnimationFrame(animate);
      controls.update(); // 关键！没有这行无法控制
      renderer.render(scene, camera);
      
    }
    animate();

  scene.add(gridHelper);
};

// 窗口适配
const handleResize = () => {
  if (!container.value || !camera || !renderer) return;
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

// 生命周期
onMounted(() => {
  initThree();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  renderer.dispose();
  cube.geometry.dispose();
  (cube.material as THREE.Material).dispose();
});
</script>

<style scoped>
.three-viewer {
  width: 100%;
  height: 100%;
  position: relative; 
  z-index: 9999;
}

.three-container {
  width: 100%;
  height: 100vh;
}
</style>