import React from "react";
import Layout from "../../components/Layout";
import styles from "./dev.module.scss";

const Dev = () => {
  return (
    <Layout navbarEnabled={true} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.content}>Hello</div>
      </div>
    </Layout>
  );
};

export default Dev;
