import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Letters: THREE.Mesh;
    Monten: THREE.Mesh;
    Cannon: THREE.Mesh;
  };
  materials: {
    Main: THREE.MeshStandardMaterial;
    Mountain: THREE.MeshStandardMaterial;
    Cannon: THREE.MeshStandardMaterial;
  };
};

export function Letters(props: React.JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/3d/Letters.gltf",
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Letters.geometry} material={materials.Main} />
      <mesh geometry={nodes.Monten.geometry} material={materials.Mountain} />
      <mesh geometry={nodes.Cannon.geometry} material={materials.Cannon} />
    </group>
  );
}

useGLTF.preload("/3d/Letters.gltf");
