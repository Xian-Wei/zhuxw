import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./layout.module.scss";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <div className={styles.children}>{children}</div>
      <Footer />
    </>
  );
}
