import React, { Suspense } from "react";
import Head from "next/head";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import Sky from "../components/3D/Sky";
import { Island } from "../components/3D/Island";

export const siteTitle = "Xian-Wei Zhu";

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
    <>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "zhuxw - Navigate through the virtual void where excitement takes a vacation, and innovation is on sabbatical."
          }
          url={"https://zhuxw.com/"}
        />
      </Head>
      <Layout navbarEnabled={true}>
        <section className={styles.container}>
          <Suspense fallback={<Loader />}>
            <Canvas className={styles.canvas} camera={{ near: 0.1, far: 1000 }}>
              <directionalLight position={[1, 1, 1]} intensity={1} />
              <ambientLight intensity={0.5} />
              <Island
                position={islandPosition as any}
                scale={islandScale as any}
                rotation={islandRotation as any}
              />
              <Sky />
            </Canvas>
          </Suspense>
        </section>
      </Layout>
    </>
  );
}
