import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChargingParticlesProps {
  count?: number;
}

export const ChargingParticles: React.FC<ChargingParticlesProps> = ({ count = 75 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particle attributes: angle, radius, height, speed
  const { positions, data } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const particleData = new Float32Array(count * 4); // [angle, radius, speed, heightOffset]

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 2.2;
      const speed = 0.8 + Math.random() * 0.9;
      const height = -0.5 + Math.random() * 1.2;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      particleData[i * 4] = angle;
      particleData[i * 4 + 1] = radius;
      particleData[i * 4 + 2] = speed;
      particleData[i * 4 + 3] = height;
    }

    return { positions: pos, data: particleData };
  }, [count]);

  const particleTexture = useMemo(() => {
    // Generate soft circular glow texture dynamically
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(0, 224, 138, 1)');
      grad.addColorStop(0.35, 'rgba(0, 224, 138, 0.7)');
      grad.addColorStop(0.8, 'rgba(0, 224, 138, 0.15)');
      grad.addColorStop(1, 'rgba(0, 224, 138, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      let angle = data[i * 4];
      let radius = data[i * 4 + 1];
      const speed = data[i * 4 + 2];
      const origHeight = data[i * 4 + 3];

      // Spiral inward towards charging port near center
      angle += delta * speed * 1.4;
      radius -= delta * speed * 0.45;

      // When reaching center, reset to outer boundary
      if (radius < 0.25) {
        radius = 2.4 + Math.random() * 0.8;
        angle = Math.random() * Math.PI * 2;
      }

      data[i * 4] = angle;
      data[i * 4 + 1] = radius;

      array[i * 3] = Math.cos(angle) * radius;
      // Slight vertical convergence towards middle battery height
      array[i * 3 + 1] = THREE.MathUtils.lerp(origHeight, -0.15, (2.8 - radius) / 2.8);
      array[i * 3 + 2] = Math.sin(angle) * radius;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#00E08A"
        map={particleTexture}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const PulsingFloorRing: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    // 3 second cycle: 0 -> 1
    const elapsed = state.clock.getElapsedTime();
    const cycle = (elapsed % 3) / 3;

    if (meshRef.current && materialRef.current) {
      // Scale expands outward from 0.8 to 2.4
      const scale = 0.8 + cycle * 1.6;
      meshRef.current.scale.set(scale, scale, 1);

      // Opacity rises then fades out towards the end of the 3s pulse
      const opacity = Math.sin(cycle * Math.PI) * (1 - cycle * 0.4) * 0.6;
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 0.74, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00E08A"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
