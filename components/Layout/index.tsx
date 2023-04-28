import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./layout.module.scss";
import { useRouter } from "next/router";

interface LayoutProps {
  children: any;
  navbarEnabled?: boolean;
  footerEnabled?: boolean;
  backgroundEnabled?: boolean;
}

const Layout = ({
  children,
  navbarEnabled = false,
  footerEnabled = false,
  backgroundEnabled = false,
}: LayoutProps) => {
  const router = useRouter();

  return (
    <>
      {backgroundEnabled && <div className={styles.backgroundImage} />}
      {navbarEnabled && (
        <div className={styles.header}>
          <Navbar />
        </div>
      )}
      <div
        className={
          router.pathname == "/"
            ? styles.childrenNoPadding
            : footerEnabled
            ? styles.children
            : styles.childrenFooterless
        }
      >
        {children}
      </div>
      {footerEnabled && (
        <div className={styles.footer}>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Layout;
