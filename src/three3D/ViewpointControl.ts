import * as THREE from 'three';
import { Three3DInstance } from './Three3D';

const Three3D = Three3DInstance;

export function zoomIn() {
  const offset = new THREE.Vector3();
  if(Three3D.controls){
    offset.subVectors(Three3D.controls.object.position, Three3D.controls.target);
    const len = offset.length();
    offset.setLength(Math.max(Three3D.controls.minDistance, len * 0.8));
    Three3D.controls.object.position.copy(Three3D.controls.target).add(offset);
  }
}

export function zoomOut() {
  const offset = new THREE.Vector3();
  if(Three3D.controls){
    offset.subVectors(Three3D.controls.object.position, Three3D.controls.target);
    const len = offset.length();
    offset.setLength(Math.min(Three3D.controls.maxDistance, len * 1.25));
    Three3D.controls.object.position.copy(Three3D.controls.target).add(offset);
  }

}