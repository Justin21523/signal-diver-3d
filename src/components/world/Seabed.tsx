import { BufferGeometry, Float32BufferAttribute } from 'three';

const SIZE = 300;
const SEGMENTS = 80;
const STEP = SIZE / SEGMENTS;

const seabedGeometry = (() => {
  const geo = new BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];

  for (let z = 0; z <= SEGMENTS; z++) {
    for (let x = 0; x <= SEGMENTS; x++) {
      const px = x * STEP - SIZE / 2;
      const pz = z * STEP - SIZE / 2;
      const py = -120 + Math.sin(x * 0.15) * 4 + Math.cos(z * 0.2) * 3 + Math.random() * 1.5;
      positions.push(px, py, pz);
    }
  }

  for (let z = 0; z < SEGMENTS; z++) {
    for (let x = 0; x < SEGMENTS; x++) {
      const a = z * (SEGMENTS + 1) + x;
      const b = a + 1;
      const c = a + SEGMENTS + 1;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
})();

const Seabed = () => (
  <mesh position={[0, 0, 0]} receiveShadow>
    <primitive object={seabedGeometry} attach="geometry" />
    <meshStandardMaterial
      color="#0f2e26"
      roughness={0.95}
      metalness={0.1}
      flatShading
    />
  </mesh>
);

export default Seabed;
