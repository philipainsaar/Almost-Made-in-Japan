'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function PearlNecklace() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.45;
  });

  const pearls = Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * Math.PI * 2;
    const x = Math.cos(angle) * 1.65;
    const y = Math.sin(angle) * 0.62 - 0.05;
    const z = Math.sin(angle) * 0.35;
    const scale = 0.13 + (index % 5) * 0.01;
    return { x, y, z, scale };
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.018, 12, 120]} />
        <meshStandardMaterial color="#c9c9c9" roughness={0.2} metalness={0.85} />
      </mesh>
      {pearls.map((pearl, index) => (
        <mesh position={[pearl.x, pearl.y, pearl.z]} scale={pearl.scale} key={index}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={index % 3 === 0 ? '#ffd8e6' : '#fff8e8'} roughness={0.12} metalness={0.03} transmission={0.08} clearcoat={1} />
        </mesh>
      ))}
      <Float speed={2.2} floatIntensity={0.18} rotationIntensity={0.4}>
        <mesh position={[0, -0.9, 0.12]} rotation={[0, 0, Math.PI / 4]} scale={[0.42, 0.42, 0.06]}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial color="#9ff3ec" roughness={0.1} metalness={0.05} transmission={0.25} clearcoat={1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function AmijJewelryCanvas({ title }: { title: string }) {
  return (
    <div className="visual-canvas-wrap" aria-label={`Jewelry visual for ${title}`}>
      <Canvas camera={{ position: [0, 0.2, 4.2], fov: 45 }} dpr={[1, 1.6]}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={2.3} />
        <directionalLight position={[3, 4, 3]} intensity={2.2} />
        <Float speed={1.2} floatIntensity={0.12}>
          <PearlNecklace />
        </Float>
        <Environment preset="studio" />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={6} />
      </Canvas>
    </div>
  );
}
