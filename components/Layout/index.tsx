import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./layout.module.scss";

const Layout = (props: {
  children: any;
  navbarEnabled: boolean;
  footerEnabled: boolean;
  backgroundEnabled: boolean;
}) => {
  return (
    <>
      {props.backgroundEnabled && <div className={styles.backgroundImage} />}
      {props.navbarEnabled && (
        <div className={styles.header}>
          <Navbar />
        </div>
      )}
      <div className={styles.children}>{props.children}</div>
      {props.footerEnabled && (
        <div className={styles.header}>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Layout;
