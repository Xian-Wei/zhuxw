import React, { useRef, useState } from "react";
import Head from "next/head";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import { Blunderbuss } from "../components/3D/Blunderbuss";

export const siteTitle = "Xian-Wei Zhu";

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function Home() {
  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Hi I'm Xian-Wei Zhu, wannabe web3 builder and wantrepreneur at @XianWeiCorp. Don't expect anything from this website. I'm drinking tea as I'm typing this. I'm just trying to have a nice long description. Yes."
          }
          url={"https://zhuxw.com/"}
        />
      </Head>
      <main className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeftContent}>
            <div className={styles.heroLeftTitle}>
              The most pointless and random website of all time.
            </div>
            <div className={styles.heroLeftDescription}>
              zhuxw is an web application that does anything but useful stuff.
              <br /> A blog, personal weight tracker, decentralized weight
              trading, NFT shop and more useless stuff to come.
            </div>
            <div className={styles.heroLeftCta}>
              <Link href="/web3" className={styles.heroLeftCtaButton}>
                Trade
              </Link>
            </div>
          </div>
          <div className={styles.heroRightContent}>
            <div className={styles.canvas}>
              <Canvas>
                <ambientLight />
                <Blunderbuss position={[0, 0, 1.5]} />
              </Canvas>
            </div>
          </div>
        </div>
        {/* <div className={styles.secondScreen}>
          <div className={styles.secondScreenContent}>
            <h1>Yes</h1>
          </div>
        </div> */}
      </main>
    </Layout>
  );
}
