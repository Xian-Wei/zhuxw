import React from "react";
import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";
import { Experience } from "../components/3D/Experience";
import useIsWidth from "../hooks/useIsWidth";
import { WindowWidth } from "../models/WindowWidth";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
  const isWidth = useIsWidth(WindowWidth.md);

  return (
    <Layout
      navbarEnabled={true}
      footerEnabled={false}
      backgroundEnabled={false}
    >
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Hi I'm Xian-Wei Zhu, wannabe web3 builder and wantrepreneur at @XianWeiCorp. I'm trying to beat the other Xian-Wei Zhu website in Google Search. Don't mind me."
          }
          url={"https://zhuxw.com/"}
        />
      </Head>
      <main className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.text}>Xian-Wei Zhu</div>
          <Canvas
            camera={isWidth ? { fov: 5, zoom: 0.03 } : { fov: 10, zoom: 0.025 }}
          >
            <ambientLight />
            <Experience />
          </Canvas>
        </div>
      </main>
    </Layout>
  );
}
