import * as THREE from 'three';
import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';
import { useGameStore } from '../../store/useGameStore';

const SourceNode = () => {
  const coreRef = useRef<Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  const sourceRepaired = useGameStore((s) => s.sourceRepaired);
  const nearest = useGameStore((s) => s.nearestInteractable);
  const isNearest = nearest?.type === 'node' && nearest.id === 'source-node';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2;
      coreRef.current.rotation.x = t * 0.15;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = t * (0.3 + i * 0.1);
        ring.rotation.z = t * (0.2 - i * 0.05);
      });
    }
  });

  const color = sourceRepaired ? '#fbbf24' : '#ef4444';

  return (
    <group position={[0, -135, 0]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[3, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={sourceRepaired ? 4 : 2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Orbital Rings */}
      <group ref={ringsRef}>
        {[4.5, 6, 7.5].map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.08, 16, 100]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      <pointLight color={color} intensity={15} distance={60} decay={2} />

      {isNearest && !sourceRepaired && (
        <Html center distanceFactor={15} style={{ pointerEvents: 'none' }} position={[0, 10, 0]}>
          <div className="bg-black/90 border-2 border-red-500 px-4 py-2 rounded text-red-400 text-lg font-mono whitespace-nowrap animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]">
            [F] INITIATE CORE ALIGNMENT
          </div>
        </Html>
      )}
      
      {sourceRepaired && (
        <Html center distanceFactor={15} style={{ pointerEvents: 'none' }} position={[0, 10, 0]}>
          <div className="text-yellow-300 text-2xl font-mono tracking-[0.3em] animate-pulse">
            SYSTEM RESTORED
          </div>
        </Html>
      )}
    </group>
  );
};

export default SourceNode;