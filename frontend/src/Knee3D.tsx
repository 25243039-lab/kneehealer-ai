import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  femurWidth: number;
  tibiaWidth: number;
}

function Knee3D({ femurWidth, tibiaWidth }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 300;
    const height = 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current?.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const femurScale = Math.max(0.5, Math.min(femurWidth / 60, 2));
    const femurGeo = new THREE.CylinderGeometry(0.5 * femurScale, 0.6 * femurScale, 2.5, 16);
    const femurMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc8 });
    const femur = new THREE.Mesh(femurGeo, femurMat);
    femur.position.y = 1.5;
    group.add(femur);

    const tibiaScale = Math.max(0.5, Math.min(tibiaWidth / 60, 2));
    const tibiaGeo = new THREE.CylinderGeometry(0.5 * tibiaScale, 0.4 * tibiaScale, 2.5, 16);
    const tibiaMat = new THREE.MeshStandardMaterial({ color: 0xf0ead6 });
    const tibia = new THREE.Mesh(tibiaGeo, tibiaMat);
    tibia.position.y = -1.5;
    group.add(tibia);

    const jointGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x4a90a4 });
    const joint = new THREE.Mesh(jointGeo, jointMat);
    group.add(joint);

    scene.add(group);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(3, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    let frameId: number;
    const animate = () => {
      group.rotation.y += 0.008;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [femurWidth, tibiaWidth]);

  return <div ref={mountRef} style={{ width: '300px', height: '300px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }} />;
}

export default Knee3D;