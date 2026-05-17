"use client";

import React, { useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import ChartPage from "./chart/ChartPage";
import ShopPage from "./shop/ShopPage";
import styles from "./web3.module.scss";
import Web3FAQPage from "./web3faq/Web3FAQPage";

const pages = ["Chart", "Shop", "FAQ"];

const Web3Page = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Chart");

  const renderPage = () => {
    switch (selectedPage) {
      case "Chart":
        return <ChartPage />;
      case "Shop":
        return <ShopPage />;
      case "FAQ":
        return <Web3FAQPage />;
      default:
        break;
    }
  };

  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <Sidebar pages={pages} setPage={setSelectedPage} />
        <div className={styles.content}>{renderPage()}</div>
      </div>
    </Layout>
  );
};

export default Web3Page;
