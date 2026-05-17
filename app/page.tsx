"use client";

import React, { Suspense } from "react";
import styles from "../styles/Home.module.scss";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import Sky from "../components/3D/Sky";
import { Experience } from "../components/3D/Experience";

export default function Home() {
  const adjustIslandForScreenSize = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if (typeof window !== "undefined")
      if (window.innerWidth < 768) {
        screenScale = [0.9, 0.9, 0.9];
      } else {
        screenScale = [1, 1, 1];
      }

    return [screenScale, screenPosition, rotation];
  };

  const [islandScale, islandPosition, islandRotation] =
    adjustIslandForScreenSize();

  return (
    <Layout navbarEnabled={false}>
      <section className={styles.container}>
        <Suspense fallback={<Loader />}>
          <Canvas className={styles.canvas} camera={{ near: 0.1, far: 1000 }}>
            <ambientLight intensity={0.5} />
            <Experience />
            <Sky />
          </Canvas>
        </Suspense>
      </section>
    </Layout>
  );
}
