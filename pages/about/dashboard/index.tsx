import React from "react";
import styles from "./dashboard.module.scss";

const Dashboard = () => {
  return (
    <div className={styles.content}>
      <div className={styles.gridContainer}>
        <div className={styles.gridItem}>A</div>
        <div className={styles.gridItem}>B</div>
        <div className={styles.gridItem}>C</div>
        <div className={styles.gridItem}>D</div>
      </div>
    </div>
  );
};

export default Dashboard;
