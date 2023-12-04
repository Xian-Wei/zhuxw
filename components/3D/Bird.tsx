import { useGLTF } from "@react-three/drei";
import React from "react";

const Sky = () => {
  const sky = useGLTF("/3d/sky.glb");

  return (
    <mesh>
      <primitive object={sky.scene} />
    </mesh>
  );
};

export default Sky;
