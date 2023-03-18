import React, { useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import Chart from "../chart";
import Shop from "../shop";
import styles from "./web3.module.scss";

const pages = ["Chart", "Shop"];

const Web3 = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Chart");

  const renderPage = () => {
    switch (selectedPage) {
      case "Chart":
        return <Chart />;
      case "Shop":
        return <Shop />;
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

export default Web3;
