import Head from "next/head";
import React, { useState } from "react";
import styles from "./about.module.scss";
import MetaTags from "../../components/MetaTags";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import Web3FAQ from "../web3/web3faq";

export const siteTitle = "Xian-Wei Zhu";
const pages = ["Dashboard", "Weight", "Caca"];

const About = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Dashboard");

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Web3FAQ />;
      default:
        break;
    }
  };

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Welcome to Xian-Wei's life tracker page - where every misstep, questionable decision, and triumph are meticulously documented for your entertainment."
          }
          url={"https://zhuxw.com/about"}
        />
      </Head>
      <div className={styles.container}>
        <Sidebar pages={pages} setPage={setSelectedPage} />
        <div className={styles.content}>{renderPage()}</div>
      </div>
    </Layout>
  );
};

export default About;
