import React, { useCallback } from "react";
import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";
import { Experience } from "../components/3D/Experience";
import useIsWidth from "../hooks/useIsWidth";
import { WindowWidth } from "../models/WindowWidth";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
  const isWidth = useIsWidth(WindowWidth.md);

  const particlesInit = async (main: Engine) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

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
            "zhuxw - Navigate through the virtual void where excitement takes a vacation, and innovation is on sabbatical."
          }
          url={"https://zhuxw.com/"}
        />
      </Head>
      <main className={styles.container}>
        <div className={styles.particles}>
          <Particles
            className={styles.particles}
            init={particlesInit}
            options={particlesOptions as any}
          />
        </div>

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

const particlesOptions = {
  fullScreen: {
    enable: true,
  },
  particles: {
    number: {
      value: 400,
      density: {
        enable: true,
      },
    },
    color: {
      value: Math.floor(Math.random() * 16777215).toString(16),
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 10,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 500,
      color: "#ffffff",
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "bottom",
      random: false,
      straight: false,
      out_mode: "out",
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.5,
        },
      },
      bubble: {
        distance: 400,
        size: 4,
        duration: 0.3,
        opacity: 1,
        speed: 3,
      },
      repulse: {
        distance: 200,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};
