import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

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

export function Letters(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/3d/Letters.gltf") as GLTFResult;
  const refLetters = useRef<THREE.Mesh>(null!);
  const refMonten = useRef<THREE.Mesh>(null!);
  const refCannon = useRef<THREE.Mesh>(null!);
  const [isClicked, setIsClicked] = useState(false);
  const [stopRotation, setStopRotation] = useState(true);

  useFrame((state, delta) => {
    if (!isClicked && !stopRotation) {
      refLetters.current.rotation.y += delta / 10;
      refMonten.current.rotation.y += delta / 10;
      refCannon.current.rotation.y += delta / 10;
    }
  });

  const onModelClick = (clicked: boolean) => {
    setIsClicked(clicked);

    if (clicked) {
      setStopRotation(!stopRotation);
    }
  };

  return (
    <group
      {...props}
      dispose={null}
      onPointerDown={() => onModelClick(true)}
      onPointerUp={() => onModelClick(false)}
    >
      <mesh
        ref={refLetters}
        geometry={nodes.Letters.geometry}
        material={materials.Main}
      />
      <mesh
        ref={refMonten}
        geometry={nodes.Monten.geometry}
        material={materials.Mountain}
      />
      <mesh
        ref={refCannon}
        geometry={nodes.Cannon.geometry}
        material={materials.Cannon}
      />
    </group>
  );
}

useGLTF.preload("/3d/Letters.gltf");
