"use client";

import React from "react";
import Layout from "../../components/Layout";
import styles from "../../pages/dev/dev.module.scss";

const DevPage = () => {
  return (
    <Layout navbarEnabled={true} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.content}>Hello</div>
      </div>
    </Layout>
  );
};

export default DevPage;
