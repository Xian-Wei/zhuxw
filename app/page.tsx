"use client";

import React, { Suspense } from "react";
import styles from "../styles/Home.module.scss";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import { Experience } from "../components/3D/Experience";

export default function Home() {
  return (
    <Layout navbarEnabled={false}>
      <section className={styles.container}>
        <Suspense fallback={<Loader />}>
          <Canvas
            style={{ height: "100vh", width: "100%" }}
            camera={{ near: 0.1, far: 1000 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, alpha: true }}
          >
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </Suspense>
      </section>
    </Layout>
  );
}
