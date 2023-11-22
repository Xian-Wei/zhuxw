import React, { Suspense } from "react";
import Head from "next/head";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import { Experience } from "../components/3D/Experience";
import Layout from "../components/Layout";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
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
              <Experience />
            </Canvas>
          </Suspense>
        </section>
      </Layout>
    </>
  );
}
