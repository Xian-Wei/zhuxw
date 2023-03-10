import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import useIsWidth from "../../hooks/useIsWidth";
import { WindowWidth } from "../../models/WindowWidth";
import Chart from "../chart";
import Shop from "../shop";
import styles from "./web3.module.scss";

enum Page {
  Chart,
  Shop,
}

const Web3 = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.Chart);
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false);
  const isWidth = useIsWidth(WindowWidth.xl);

  const switchPage = (page: Page) => {
    switch (page) {
      case Page.Chart:
        setSelectedPage(Page.Chart);
        setSidebarToggle(false);
        break;
      case Page.Shop:
        setSelectedPage(Page.Shop);
        setSidebarToggle(false);
        break;
      default:
        break;
    }
  };

  const renderPage = () => {
    switch (selectedPage) {
      case Page.Chart:
        return <Chart />;
      case Page.Shop:
        return <Shop />;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!isWidth) {
      setSidebarToggle(false);
    }
  }, [isWidth]);

  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarLinks}>
            <div
              className={styles.sidebarLink}
              onClick={() => switchPage(Page.Chart)}
            >
              Chart
            </div>
            <div
              className={styles.sidebarLink}
              onClick={() => switchPage(Page.Shop)}
            >
              Shop
            </div>
          </div>
        </div>
        {/* Mobile Sidebar */}
        <div
          className={
            sidebarToggle ? styles.collapsedMobileSidebar : styles.mobileSidebar
          }
        >
          <div className={styles.sidebarLinks}>
            <div
              className={styles.sidebarLink}
              onClick={() => switchPage(Page.Chart)}
            >
              Chart
            </div>
            <div
              className={styles.sidebarLink}
              onClick={() => switchPage(Page.Shop)}
            >
              Shop
            </div>
          </div>
          <div
            className={styles.sidebarToggle}
            onClick={() => setSidebarToggle(!sidebarToggle)}
          >
            {sidebarToggle ? <b>{"<"}</b> : <b>{">"}</b>}
          </div>
        </div>
        <div className={styles.content}>{renderPage()}</div>
      </div>
    </Layout>
  );
};

export default Web3;
