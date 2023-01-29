import React from "react";
import Layout from "../../components/Layout";
import styles from "./claim.module.scss";

const Claim = () => {
  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.claimButton}>Claim</div>
      </div>
    </Layout>
  );
};

export default Claim;
