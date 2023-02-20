import Head from "next/head";
import React from "react";
import Layout from "../../components/Layout";
import MetaTags from "../../components/MetaTags";
import styles from "./claim.module.scss";

export const siteTitle = "XWZ NFT";

const Claim = () => {
  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Xian-Wei Zhu's hand-drawn NFT collection. Totally worthless but it's free."
          }
          url={"https://zhuxw.com/claim"}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.claimButton}>Claim</div>
      </div>
    </Layout>
  );
};

export default Claim;
