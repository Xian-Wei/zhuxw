"use client";

import React, { Suspense } from "react";
import styles from "../styles/Home.module.scss";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import { Experience } from "../components/3D/Experience";

export default function Home() {
  return (
    <Layout navbarEnabled={false}>
      <section className={styles.container}>
        <Canvas
          style={{ height: "100vh", width: "100%" }}
          camera={{ near: 0.1, far: 1000 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
        >
          <Suspense fallback={<Html center><Loader /></Html>}>
            <Experience />
          </Suspense>
        </Canvas>
      </section>
    </Layout>
  );
}
