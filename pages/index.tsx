import React from "react";
import Head from "next/head";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";

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
      <main className={styles.container}>Home</main>
    </>
  );
}
