import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { a } from "@react-spring/three";

type GLTFResult = GLTF & {
  nodes: {
    pCube11_rocks1_0: THREE.Mesh;
    polySurface944_tree_body_0: THREE.Mesh;
    polySurface945_tree1_0: THREE.Mesh;
    polySurface946_tree2_0: THREE.Mesh;
    polySurface947_tree1_0: THREE.Mesh;
    polySurface948_tree_body_0: THREE.Mesh;
    polySurface949_tree_body_0: THREE.Mesh;
  };
  materials: {
    PaletteMaterial001: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

export function Island(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/3d/island.glb") as GLTFResult;
  const islandRef = useRef<any>();

  return (
    <a.group {...props} dispose={null} ref={islandRef}>
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <instancedMesh
        args={[
          nodes.polySurface944_tree_body_0.geometry,
          materials.PaletteMaterial001,
          8,
        ]}
      />
      <instancedMesh
        args={[
          nodes.polySurface945_tree1_0.geometry,
          materials.PaletteMaterial001,
          5,
        ]}
      />
      <instancedMesh
        args={[
          nodes.polySurface946_tree2_0.geometry,
          materials.PaletteMaterial001,
          5,
        ]}
      />
      <instancedMesh
        args={[
          nodes.polySurface947_tree1_0.geometry,
          materials.PaletteMaterial001,
          5,
        ]}
      />
      <instancedMesh
        args={[
          nodes.polySurface948_tree_body_0.geometry,
          materials.PaletteMaterial001,
          8,
        ]}
      />
      <instancedMesh
        args={[
          nodes.polySurface949_tree_body_0.geometry,
          materials.PaletteMaterial001,
          8,
        ]}
      />
    </a.group>
  );
}

useGLTF.preload("/3d/island.glb");
