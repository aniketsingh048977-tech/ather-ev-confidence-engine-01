import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScooterModelProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: number;
}

export const ScooterModel: React.FC<ScooterModelProps> = ({ pointer, scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);

  // Materials
  const matteCharcoal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#15181C'),
        roughness: 0.55,
        metalness: 0.35,
      }),
    []
  );

  const darkRubber = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0A0C0E'),
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  const greenGlowLine = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#00E08A'),
        emissive: new THREE.Color('#00E08A'),
        emissiveIntensity: 2.2,
        roughness: 0.2,
      }),
    []
  );

  const headlightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFFFFF'),
        emissive: new THREE.Color('#E6FFF6'),
        emissiveIntensity: 3.5,
        roughness: 0.1,
      }),
    []
  );

  const seatMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1F2328'),
        roughness: 0.9,
        metalness: 0.1,
      }),
    []
  );

  const spokeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3A414A'),
        roughness: 0.4,
        metalness: 0.8,
      }),
    []
  );

  // Spokes geometry helper
  const spokeAngles = useMemo(() => [0, Math.PI / 3, (2 * Math.PI) / 3], []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Wheels spin slowly
    if (frontWheelRef.current) {
      frontWheelRef.current.rotation.z -= delta * 1.8;
    }
    if (rearWheelRef.current) {
      rearWheelRef.current.rotation.z -= delta * 1.8;
    }

    if (groupRef.current) {
      // Gentle floating bobbing
      const floatY = Math.sin(time * 1.5) * 0.04;
      groupRef.current.position.y = floatY;

      // Base slow 360 rotation + scroll-driven rotation to side profile
      // Scroll moves it into sleek side orientation
      const targetBaseY = time * 0.35 + scrollProgress * Math.PI * 1.2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetBaseY,
        0.05
      );

      // Tilts toward mouse pointer
      const targetTiltX = pointer.current.y * 0.15;
      const targetTiltZ = -pointer.current.x * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetTiltX,
        0.08
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetTiltZ,
        0.08
      );

      // Slight zoom / scale with scroll
      const targetScale = 1 + scrollProgress * 0.22;
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* --- REAR WHEEL ASSEMBLY --- */}
      <group position={[-1.15, -0.4, 0]}>
        <group ref={rearWheelRef}>
          {/* Tire */}
          <mesh material={darkRubber} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.38, 0.08, 20, 48]} />
          </mesh>
          {/* Rim */}
          <mesh material={matteCharcoal} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.08, 24]} />
          </mesh>
          {/* Spokes */}
          {spokeAngles.map((angle, i) => (
            <mesh
              key={i}
              material={spokeMaterial}
              rotation={[0, 0, angle]}
            >
              <cylinderGeometry args={[0.015, 0.015, 0.58, 12]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* --- FRONT WHEEL ASSEMBLY --- */}
      <group position={[1.15, -0.4, 0]}>
        <group ref={frontWheelRef}>
          {/* Tire */}
          <mesh material={darkRubber}>
            <torusGeometry args={[0.38, 0.08, 20, 48]} />
          </mesh>
          {/* Rim */}
          <mesh material={matteCharcoal} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.08, 24]} />
          </mesh>
          {/* Spokes */}
          {spokeAngles.map((angle, i) => (
            <mesh
              key={i}
              material={spokeMaterial}
              rotation={[0, 0, angle]}
            >
              <cylinderGeometry args={[0.015, 0.015, 0.58, 12]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* --- LOWER CHASSIS / FLOORBOARD --- */}
      <mesh material={matteCharcoal} position={[0, -0.3, 0]}>
        <boxGeometry args={[1.35, 0.1, 0.44]} />
      </mesh>

      {/* Glowing green trim strip along floorboard bottom edge */}
      <mesh material={greenGlowLine} position={[0, -0.32, 0.23]}>
        <boxGeometry args={[1.32, 0.02, 0.02]} />
      </mesh>
      <mesh material={greenGlowLine} position={[0, -0.32, -0.23]}>
        <boxGeometry args={[1.32, 0.02, 0.02]} />
      </mesh>

      {/* --- REAR BODY & SUBFRAME FAIRING --- */}
      <mesh
        material={matteCharcoal}
        position={[-0.65, 0.05, 0]}
        rotation={[0, 0, 0.18]}
      >
        <boxGeometry args={[0.95, 0.42, 0.4]} />
      </mesh>

      {/* Glowing accent line sweeping along rear body */}
      <mesh
        material={greenGlowLine}
        position={[-0.62, 0.15, 0.21]}
        rotation={[0, 0, 0.18]}
      >
        <boxGeometry args={[0.88, 0.025, 0.015]} />
      </mesh>
      <mesh
        material={greenGlowLine}
        position={[-0.62, 0.15, -0.21]}
        rotation={[0, 0, 0.18]}
      >
        <boxGeometry args={[0.88, 0.025, 0.015]} />
      </mesh>

      {/* Rear Fender */}
      <mesh
        material={matteCharcoal}
        position={[-1.12, -0.05, 0]}
        rotation={[0, 0, -0.35]}
      >
        <boxGeometry args={[0.48, 0.07, 0.26]} />
      </mesh>

      {/* --- ERGONOMIC SEAT --- */}
      <mesh
        material={seatMaterial}
        position={[-0.55, 0.32, 0]}
        rotation={[0, 0, 0.08]}
      >
        <boxGeometry args={[0.85, 0.12, 0.34]} />
      </mesh>

      {/* --- FRONT APRON & STEER COLUMN --- */}
      {/* Angled apron */}
      <mesh
        material={matteCharcoal}
        position={[0.72, 0.2, 0]}
        rotation={[0, 0, -0.36]}
      >
        <boxGeometry args={[0.26, 0.95, 0.4]} />
      </mesh>

      {/* Glowing green accent chevron on front apron */}
      <mesh
        material={greenGlowLine}
        position={[0.87, 0.2, 0]}
        rotation={[0, 0, -0.36]}
      >
        <boxGeometry args={[0.02, 0.72, 0.03]} />
      </mesh>

      {/* Front steering stem */}
      <mesh
        material={matteCharcoal}
        position={[0.86, 0.58, 0]}
        rotation={[0, 0, -0.36]}
      >
        <cylinderGeometry args={[0.035, 0.045, 0.65, 16]} />
      </mesh>

      {/* Front Wheel Fork */}
      <mesh
        material={spokeMaterial}
        position={[1.05, -0.15, 0.1]}
        rotation={[0, 0, -0.36]}
      >
        <cylinderGeometry args={[0.022, 0.022, 0.55, 12]} />
      </mesh>
      <mesh
        material={spokeMaterial}
        position={[1.05, -0.15, -0.1]}
        rotation={[0, 0, -0.36]}
      >
        <cylinderGeometry args={[0.022, 0.022, 0.55, 12]} />
      </mesh>

      {/* --- HANDLEBAR & CONTROLS --- */}
      <group position={[0.96, 0.88, 0]}>
        {/* Horizontal bar */}
        <mesh material={matteCharcoal} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.82, 16]} />
        </mesh>
        {/* Grips */}
        <mesh material={seatMaterial} position={[0, 0, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 16]} />
        </mesh>
        <mesh material={seatMaterial} position={[0, 0, -0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 16]} />
        </mesh>
        {/* Sleek dashboard module */}
        <mesh material={matteCharcoal} position={[-0.04, 0.05, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.22]} />
        </mesh>
      </group>

      {/* --- HEADLIGHT (Soft white light) --- */}
      <group position={[0.94, 0.42, 0]}>
        {/* Physical lens */}
        <mesh material={headlightMaterial} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
        </mesh>
        {/* Soft forward white light emission */}
        <pointLight
          color="#FFFFFF"
          intensity={2.8}
          distance={4.5}
          decay={2}
          position={[0.2, 0, 0]}
        />
        <spotLight
          color="#E8FAFF"
          intensity={3.5}
          distance={6}
          angle={0.65}
          penumbra={0.6}
          position={[0.1, 0, 0]}
          target-position={[3, -0.5, 0]}
        />
      </group>
    </group>
  );
};
