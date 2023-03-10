import Head from "next/head";
import React from "react";
import MetaTags from "../../components/MetaTags";
import styles from "./shop.module.scss";

export const siteTitle = "XWZ Web3 Shop";

const Shop = () => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "The zhuxw shop is the world's most useless Web3 shop as it exclusively contains worthless NFTs."
          }
          url={"https://zhuxw.com/shop"}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.shopButton}>Shop</div>
      </div>
    </>
  );
};

export default Shop;
