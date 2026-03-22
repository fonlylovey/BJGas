import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"


export class Three3D {
  // 单例实例
  private static _instance: Three3D | null = null;
  
  // Three.js 核心对象
  public scene: THREE.Scene | null = null;
  public camera: THREE.PerspectiveCamera | null = null;
  public renderer: THREE.WebGLRenderer | null = null;
  public controls: OrbitControls | null = null;
  
  // 内部变量
  private container: HTMLElement | null = null;
  private animationId: number | null = null;
  private composer: EffectComposer | null = null;
  private outlinePass: OutlinePass | null = null;
  private renderPass: RenderPass | null = null;

  public raycaster: THREE.Raycaster | null = null;
  public mouse: THREE.Vector2 | null = null;
  public currentHovered: THREE.Object3D | null = null;
  public currentSelected: THREE.Object3D | null = null;

  //保存原始材质属性，用于恢复
  private originalMaterials: Map<number, { color: THREE.Color; emissive: THREE.Color; emissiveIntensity: number }> = new Map();


  // 私有构造函数（单例模式）
  private constructor() {}

  // 获取单例实例
  public static getInstance(): Three3D {
    if (!Three3D._instance) {
      Three3D._instance = new Three3D();
    }
    return Three3D._instance;
  }

  // 初始化 Three.js
  public init(container: HTMLElement): void {
    if (this.scene) return; // 防止重复初始化

    this.container = container;

    // 初始化场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe8f2fc);

    // 初始化相机
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(2.76, 6.37, 3.82);

    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // 初始化轨道控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    //地面
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
    this.scene.add(floor);
    // 地面网格线
    const gridHelper = new THREE.GridHelper(20, 20, 0xb8c8d8, 0xc8d4e0);
    gridHelper.position.y = -0.48;
    this.scene.add(gridHelper);

    // 坐标轴辅助线
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 8;
    dirLight.shadow.camera.bottom = -8;
    dirLight.shadow.bias = -0.0001;
    this.scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-3, 4, -3);
    this.scene.add(fillLight);

    let geom = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geom);
    mesh.position.set(-3, 4, -3);
    this.scene.add(mesh);
    // 启动渲染循环
    this.render();

    // 监听窗口大小变化
    window.addEventListener('resize', this.resize);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  // 渲染循环
  private render = (): void => {
    this.animationId = requestAnimationFrame(this.render);
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    if(this.composer){
        this.composer.render();
    }
  };

  // 添加物体到场景
  public addObject(object: THREE.Object3D): void {
    if (this.scene) {
      this.scene.add(object);
    }
  }

  // 从场景移除物体
  public removeObject(object: THREE.Object3D): void {
    if (this.scene) {
      this.scene.remove(object);
    }
  }

  public highLightObject(selectedObject: THREE.Object3D): void{
    if(this.renderer && this.scene && this.camera){
        // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
        this.composer = new EffectComposer(this.renderer)
        // 新建一个场景通道  为了覆盖到原理来的场景上
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass);
        // 物体边缘发光通道
        this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera, [selectedObject])
        this.outlinePass.selectedObjects = [selectedObject]
        this.outlinePass.edgeStrength = 10.0 // 边框的亮度
        this.outlinePass.edgeGlow = 1// 光晕[0,1]
        this.outlinePass.usePatternTexture = false // 是否使用父级的材质
        this.outlinePass.edgeThickness = 1.0 // 边框宽度
        this.outlinePass.downSampleRatio = 1 // 边框弯曲度
        this.outlinePass.pulsePeriod = 5 // 呼吸闪烁的速度
        this.outlinePass.visibleEdgeColor.set(0x00ff00) // 呼吸显示的颜色
        this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
        this.outlinePass.clear = true
        this.composer.addPass(this.outlinePass)
        // 自定义的着色器通道 作为参数
        var effectFXAA = new ShaderPass(FXAAShader)
        effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)
        effectFXAA.renderToScreen = true
        this.composer.addPass(effectFXAA);
        this.currentSelected = selectedObject;
    }
  }

  public unhighlightObject(object: THREE.Object3D): void {
    this.currentSelected = null;
    this.composer = null;                                                                       
  }

  public animateCameraTo(position: THREE.Vector3, target: THREE.Vector3) {
    if(this.camera && this.controls)
    {
        const startPos = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();
        const tick = () => {
            const t = Math.min(1, (Date.now() - startTime) / 800);
            const ease = 1 - (1 - t) * (1 - t); // easeOutQuad
            this.camera.position.lerpVectors(startPos, position, ease);
            this.controls.target.lerpVectors(startTarget, target, ease);
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
}

public getCameraPosition(): { position: THREE.Vector3; target: THREE.Vector3 } | null {
  if (this.camera && this.controls) {
      return {
          position: this.camera.position.clone(),
          target: this.controls.target.clone()
      };
  }
  return null;
}

  // 窗口大小适配
  public resize = (): void => {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  // 销毁 Three.js 实例（清理资源）
  public destroy(): void {
    // 1. 停止渲染循环
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // 2. 移除窗口监听
    window.removeEventListener('resize', this.resize);

    // 3. 销毁渲染器
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }

    // 4. 清空场景（可选，根据需求）
    if (this.scene) {
      while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
        // 这里可以进一步 dispose 几何体和材质
      }
    }

    // 5. 重置所有属性
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.container = null;
    this.animationId = null;
    Three3D._instance = null; // 重置单例
  }

  public onMouseClick(event: MouseEvent): THREE.Object3D | null {
    if (!this.container || !this.camera || !this.scene || !this.raycaster || !this.mouse) {
      return null;
    }
    // 1. 计算鼠标在标准化设备坐标中的位置 (-1 到 +1)
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    // 2. 更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    //this.raycaster.layers.set(1);
    // 3. 检测射线与物体的交点

    const visibleObjects: THREE.Object3D[] = [];
    this.scene.traverse(item =>{
        if(item.visible === true){
            visibleObjects.push(item);
        }
    })
    const intersects = this.raycaster.intersectObjects(visibleObjects, false);
    if (intersects.length > 0) {
      // 找到第一个可点击的物体（你可以给模型加 userData.isClickable = true 来标记）
      let clickedObject = intersects[0].object;
      
      return clickedObject;
      /*
      // 向上遍历，找到父级模型（如果点击的是子网格）
      while (clickedObject.parent && !clickedObject.userData.isClickable) {
        clickedObject = clickedObject.parent;
      }

      if (clickedObject.userData.isClickable || clickedObject.type === 'Group') {
        return clickedObject;
      }
        */
    }

    return null;
  }

    public createLogoMesh(w: number, h: number) {
        const logoGeom = new THREE.PlaneGeometry(w || 0.8, h || 0.64);
        const mat = new THREE.MeshBasicMaterial({ color: 0x1a2a3a });
        return new THREE.Mesh(logoGeom, mat);
    }

    public createLogoStand(w: number, d: number) {
        const standGeom = new THREE.BoxGeometry((w || 0.85) + 0.05, 0.04, (d || 0.69) + 0.05);
        const standMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
        const stand = new THREE.Mesh(standGeom, standMat);
        stand.position.y = -0.34;
        stand.castShadow = true;
        stand.receiveShadow = true;
        return stand;
    }

// 加载图片并去除白色背景，返回透明纹理（同源时可用）
public loadImageWithTransparentBg(url:string, whiteThreshold = 235) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(id, 0, 0);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      resolve(tex);
    };
    img.onerror = reject;
    img.src = url;
  });
}

public createCornerLogoMesh = () => {
    // 3D Logo：四角用 logo，横边（左右）用 logo2
    let logo3d = null;
    const logoCorners = [
        { x: -5, z: 5 },   // 前左
        { x: 5, z: 5 },   // 前右
        { x: -5, z: -5 }, // 后左
        { x: 5, z: -5 },  // 后右
    ];
    const logo2Sides = [
        { x: -5, z: 0 },  // 左侧（横边）
        { x: 5, z: 0 },   // 右侧（横边）
    ];

    const logoGroup = new THREE.Group();
    const logoPlanes: any = [];
    const logo2Planes: any = [];

    // 四角：logo
    logoCorners.forEach(({ x, z }) => {
    const corner = new THREE.Group();
    corner.position.set(x, -0.2, z);
    corner.rotation.y = Math.atan2(-x, -z);

    const plane = this.createLogoMesh(0.8, 0.64);
    corner.add(plane);
    logoPlanes.push(plane);

    const stand = this.createLogoStand(0.85, 0.69);
    //corner.add(stand);

    logoGroup.add(corner);
    });

    // 横边（左右）：logo2，稍大
    logo2Sides.forEach(({ x, z }) => {
    const side = new THREE.Group();
    side.position.set(x, -0.2, z);
    side.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; // 面向中心

    const plane = this.createLogoMesh(0.9, 0.5);
    side.add(plane);
    logo2Planes.push(plane);

    const stand = this.createLogoStand(0.95, 0.55);
    //side.add(stand);

    logoGroup.add(side);
    });
    if(this.scene){
        this.scene.add(logoGroup);
    }
    logo3d = logoGroup;
    new THREE.TextureLoader().load('/images/logo_1.png', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const logoMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
    });
    logoPlanes.forEach((p) => { p.material = logoMat; });
    }, undefined, () => {console.log("BBB");});

    
    this.loadImageWithTransparentBg('/images/logo_2.png', 230).then((tex) => {
        const logo2Mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            side: THREE.DoubleSide,
        });
        logo2Planes.forEach((p) => { p.material = logo2Mat; });
    }).catch(() => {
        new THREE.TextureLoader().load('/images/logo_2.png', (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            const logo2Mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            side: THREE.DoubleSide,
            });
            logo2Planes.forEach((p) => { p.material = logo2Mat; });
        });
    });
}

}

export const Three3DInstance = Three3D.getInstance();