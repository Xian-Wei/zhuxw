import React from "react";
import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";
import { Experience } from "../components/3D/Experience";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
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
          <Canvas>
            <ambientLight />
            <Experience />
          </Canvas>
        </div>
      </main>
    </Layout>
  );
}
