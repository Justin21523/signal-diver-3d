import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Define custom shader material
const CausticsMaterialImpl = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#2dd4bf') },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv * 12.0;
      float t = uTime * 0.15;
      
      // Layered trigonometric functions to simulate caustics
      float v = 0.0;
      uv += vec2(sin(uv.y * 2.0 + t), cos(uv.x * 2.0 + t)) * 0.6;
      v += sin(uv.x * 3.0 + uv.y * 2.0 + t);
      
      uv += vec2(cos(uv.y * 1.5 - t), sin(uv.x * 1.5 - t)) * 0.6;
      v += sin(uv.x * 2.5 - uv.y * 3.0 - t);
      
      v = v * 0.5 + 0.5;
      v = pow(v, 5.0); // Sharpen the highlights
      
      gl_FragColor = vec4(uColor * v, v * 0.45);
    }
  `
);

extend({ CausticsMaterialImpl });

declare module '@react-three/fiber' {
  interface ThreeElements {
    causticsMaterialImpl: object;
  }
}

const CausticsPlane = () => {
  const matRef = useRef<{ uTime: number }>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -118, 0]}>
      <planeGeometry args={[400, 400, 1, 1]} />
      <causticsMaterialImpl ref={matRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

export default CausticsPlane;