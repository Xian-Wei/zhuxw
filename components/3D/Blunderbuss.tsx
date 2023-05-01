import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Cannon: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

export function Blunderbuss(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/3d/blunderbuss.gltf") as GLTFResult;
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.y += delta));

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        geometry={nodes.Cannon.geometry}
        material={materials.Material}
      />
    </group>
  );
}

useGLTF.preload("/3d/blunderbuss.gltf");
