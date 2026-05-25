import { forwardRef } from 'react';
import { Group } from 'three';

/**
 * Simplified Signal Diver submarine.
 * Local forward axis is +Z (cockpit points toward +Z).
 */
const Submarine = forwardRef<Group>((_props, ref) => {
  return (
    <group ref={ref}>
      {/* Main hull — capsule rotated so its long axis aligns with +Z */}
      <mesh castShadow rotation={[-Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.42, 1.3, 8, 16]} />
        <meshStandardMaterial
          color="#2a4a6a"
          metalness={0.75}
          roughness={0.28}
          emissive="#0a2540"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Cockpit window */}
      <mesh position={[0, 0.15, 0.75]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial
          color="#4dd0e1"
          emissive="#00bcd4"
          emissiveIntensity={1.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Front headlight */}
      <pointLight
        position={[0, 0.1, 1.3]}
        color="#80deea"
        intensity={2.4}
        distance={18}
        decay={2}
      />

      {/* Side engine pods */}
      <mesh position={[0.55, -0.1, -0.3]}>
        <boxGeometry args={[0.22, 0.22, 0.7]} />
        <meshStandardMaterial color="#1a3550" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[-0.55, -0.1, -0.3]}>
        <boxGeometry args={[0.22, 0.22, 0.7]} />
        <meshStandardMaterial color="#1a3550" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Rear thruster glow */}
      <mesh position={[0, 0, -1.05]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
      <pointLight
        position={[0, 0, -1.1]}
        color="#00e5ff"
        intensity={1.2}
        distance={6}
        decay={2}
      />
    </group>
  );
});

Submarine.displayName = 'Submarine';
export default Submarine;