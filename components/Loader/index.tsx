import React from "react";
import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <div className={styles.ringOuter} />
        <div className={styles.ringInner} />
        <div className={styles.core} />
      </div>
    </div>
  );
};

export default Loader;
