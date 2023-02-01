import Head from "next/head";
import React from "react";
import Layout from "../../components/Layout";
import styles from "./claim.module.scss";

export const siteTitle = "XWZ NFT";

const Claim = () => {
  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="og:title" content={siteTitle} />
        <meta
          name="og:description"
          content="Xian-Wei Zhu's hand-drawn NFT collection. Totally worthless but it's free."
        />
        <meta
          property="og:image"
          content={`https://zhuxw.com/images/comedy.png`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.claimButton}>Claim</div>
      </div>
    </Layout>
  );
};

export default Claim;
