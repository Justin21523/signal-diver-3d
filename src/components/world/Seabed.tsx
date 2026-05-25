import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';

const Seabed = () => {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const size = 300;
    const segments = 80;
    geo.setFromPoints([]);
    
    // Create a flat plane
    const positions: number[] = [];
    const indices: number[] = [];
    const step = size / segments;
    
    for (let z = 0; z <= segments; z++) {
      for (let x = 0; x <= segments; x++) {
        const px = x * step - size / 2;
        const pz = z * step - size / 2;
        // Procedural height variation
        const py = -120 + Math.sin(x * 0.15) * 4 + Math.cos(z * 0.2) * 3 + Math.random() * 1.5;
        positions.push(px, py, pz);
      }
    }
    
    for (let z = 0; z < segments; z++) {
      for (let x = 0; x < segments; x++) {
        const a = z * (segments + 1) + x;
        const b = a + 1;
        const c = a + segments + 1;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color="#0f2e26"
        roughness={0.95}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
};

export default Seabed;