import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Letters: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
  };
};

export function Letters(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/3d/Letters.gltf") as GLTFResult;
  const ref = useRef<THREE.Mesh>(null!);

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        geometry={nodes.Letters.geometry}
        material={materials.Material}
      />
    </group>
  );
}

useGLTF.preload("/3d/Letters.gltf");
