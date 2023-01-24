import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./layout.module.scss";

const Layout = (props: {
  children: any;
  navbarEnabled: boolean;
  footerEnabled: boolean;
}) => {
  return (
    <>
      {props.navbarEnabled && <Navbar />}
      <div className={styles.children}>{props.children}</div>
      {props.footerEnabled && <Footer />}
    </>
  );
};

export default Layout;
