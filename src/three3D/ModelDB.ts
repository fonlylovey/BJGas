import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

/**
 * 模型加载类
 * 负责加载 FBX 模型，不自动添加到场景
 */
export class ModelDB {
  // 单例模式（可选，避免重复创建 Loader）
  private static _instance: ModelDB | null = null;
  
  // FBX 加载器实例
  private fbxLoader: FBXLoader;

  // 私有构造函数（单例模式）
  private constructor() {
    this.fbxLoader = new FBXLoader();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ModelDB {
    if (!ModelDB._instance) {
      ModelDB._instance = new ModelDB();
    }
    return ModelDB._instance;
  }

  /**
   * 加载 FBX 模型（核心方法）
   * @param url 模型文件路径（支持相对路径/绝对路径/代理路径）
   * @returns Promise<THREE.Object3D> 加载完成的模型对象
   */
  public loadFBXModel(url: string, onProgress?: (percent: number, info: string) => void): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(
        url,
        (model: THREE.Object3D) => {
          console.log(`✅ 模型加载成功: ${url}`);
          // 可选：在这里做一些通用的模型预处理（比如修复材质、遍历Mesh）
          // 但不添加到场景，只返回原始模型
          this.preprocessModel(model);
          
          resolve(model);
        },
        
        // 加载进度回调
        (progress: ProgressEvent) => {
          if (progress.total > 0) {
            const percent = ((progress.loaded / progress.total) * 100);
            if (percent >= 100) {
            // 👇 关键：下载完但还在解析，显示这个文字
            onProgress?.(100, "模型下载完成，正在解析中...");
          } else {
            onProgress?.(percent, "模型下载中，请稍候...");
          }
          }
        },
        
        // 4. 加载失败回调
        (error: any) => {
          console.error(`❌ 模型加载失败: ${url}`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * 通用模型预处理（可选，根据需求开启）
   * 比如：修复材质、开启阴影、统一缩放等
   */
  private preprocessModel(model: THREE.Object3D): void {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 1. 开启材质更新
        if (child.material) {
          const materials = Array.isArray(child.material) 
            ? child.material 
            : [child.material];
            this.modelLsit.set(child.name, child);
          materials.forEach((mat) => {
            mat.needsUpdate = true;
            
            // 可选：统一调整材质参数（让模型更亮）
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = 0.5;
              mat.metalness = 1.0;
            }
          });
        }

        // 2. 开启阴影投射和接收
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  /**
   * 批量加载 FBX 模型（扩展方法）
   * @param urls 模型路径数组
   * @returns Promise<THREE.Object3D[]> 加载完成的模型数组
   */
  public async loadFBXModels(urls: string[]): Promise<THREE.Object3D[]> {
    const modelPromises = urls.map(url => this.loadFBXModel(url));
    return Promise.all(modelPromises);
  }

  public modelObj: THREE.Object3D | null = null;
  public modelLsit: Map<string, THREE.Object3D> = new Map<string, THREE.Object3D>();;
}

// 便捷导出：直接导出单例实例，不用每次 getInstance
export const modelDB = ModelDB.getInstance();