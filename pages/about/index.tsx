import Head from "next/head";
import React, { useState } from "react";
import styles from "./about.module.scss";
import MetaTags from "../../components/MetaTags";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import Dashboard from "./dashboard";
import Weight from "./weight";
import Workout from "./workout";

export const siteTitle = "Xian-Wei Zhu";
const pages = ["Dashboard", "Weight", "Workout"];

const About = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Dashboard");

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Weight":
        return <Weight />;
      case "Workout":
        return <Workout />;
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
