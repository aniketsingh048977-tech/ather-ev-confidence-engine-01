import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshReflectorMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ScooterModel } from './ScooterModel';
import { ChargingParticles, PulsingFloorRing } from './ChargingEffects';
import { ScooterSvgFallback } from './ScooterSvgFallback';
import { isWebGLAvailable } from './webgl-utils';

interface ScooterCanvasProps {
  scrollProgress?: number;
  className?: string;
  isMobile?: boolean;
}

// Pulsing Green Ring Loading Indicator
const LoadingPulsingRing: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#00E08A] animate-ping opacity-60" />
        <div className="absolute w-12 h-12 rounded-full border border-[#00E08A] shadow-[0_0_20px_#00E08A] animate-pulse" />
        <div className="absolute w-3 h-3 rounded-full bg-[#00E08A]" />
      </div>
      <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E08A]/80">
        Initializing 3D Engine
      </span>
    </div>
  );
};

export const ScooterCanvas: React.FC<ScooterCanvasProps> = ({
  scrollProgress = 0,
  className = '',
  isMobile = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Track mouse coordinates relative to container center
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current = { x, y };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0, y: 0 };
  };

  // If WebGL check failed or component errored, show SVG fallback
  if (hasWebGL === false || hasError) {
    return <ScooterSvgFallback className={className} />;
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full select-none ${className}`}
    >
      <Suspense fallback={<LoadingPulsingRing />}>
        <Canvas
          camera={{ position: [0, 1.1, 4.4], fov: 42 }}
          dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
          onError={() => setHasError(true)}
          className="w-full h-full"
        >
          {/* Subtle Fog for depth */}
          <fog attach="fog" args={['#0B0D10', 8, 20]} />

          {/* Lighting Rig */}
          <ambientLight intensity={0.5} />
          
          {/* Main Key Studio Light */}
          <directionalLight
            position={[4, 6, 4]}
            intensity={1.8}
            color="#FFFFFF"
            castShadow
          />

          {/* Secondary Fill Light */}
          <directionalLight
            position={[-4, 3, 2]}
            intensity={0.6}
            color="#A4B5C6"
          />

          {/* Electric Green Rim Light behind the scooter */}
          <spotLight
            position={[-3.5, 3.5, -4]}
            target-position={[0, 0, 0]}
            intensity={5.5}
            color="#00E08A"
            angle={0.8}
            penumbra={0.7}
          />
          <pointLight
            position={[0, 1.8, -2.5]}
            intensity={3.2}
            color="#00E08A"
            distance={7}
          />

          {/* 3D Scooter Model with rotation, tilt, and scroll zoom */}
          <ScooterModel pointer={pointerRef} scrollProgress={scrollProgress} />

          {/* Glowing Green Particles swirling toward the scooter */}
          <ChargingParticles count={isMobile ? 30 : 70} />

          {/* Pulsing Floor Ring every 3 seconds */}
          <PulsingFloorRing />

          {/* Soft Contact Shadow beneath scooter */}
          <ContactShadows
            position={[0, -0.69, 0]}
            opacity={0.75}
            scale={5}
            blur={1.8}
            far={2.5}
            color="#000000"
          />

          {/* Studio floor circle */}
          <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[4.5, 64]} />
            <meshStandardMaterial
              color="#0F1216"
              roughness={0.7}
              metalness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Canvas>
      </Suspense>
    </div>
  );
};
