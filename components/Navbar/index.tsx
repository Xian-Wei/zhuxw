import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./navbar.module.scss";
import useIsWidth from "../../hooks/useIsWidth";
import Web3Wallet from "../Web3Wallet";
import { WindowWidth } from "../../models/WindowWidth";
import Web3Network from "../Web3Network";

const Navbar = () => {
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
  const isWidth = useIsWidth(WindowWidth.md);

  useEffect(() => {
    if (!isWidth) {
      setNavbarToggle(false);
    }
  }, [isWidth]);

  return (
    <nav className={styles.nav}>
      <div className={styles.leftContainer}>
        <Link
          href="/"
          className={styles.homeLink}
          onClick={() => setNavbarToggle(false)}
        >
          zhuxw
        </Link>
      </div>
      <div className={styles.middleContainer}>
        <Link href="/blog" className={styles.link}>
          Blog
        </Link>
        <Link href="/chart" className={styles.link}>
          Chart
        </Link>
        <Link href="/claim" className={styles.link}>
          Claim
        </Link>
      </div>
      <div className={styles.rightContainer}>
        <Web3Network />
        <Web3Wallet />
        {navbarToggle ? (
          <FaTimes
            className={styles.toggle}
            onClick={() => setNavbarToggle(false)}
          />
        ) : (
          <FaBars
            className={styles.toggle}
            onClick={() => setNavbarToggle(true)}
          />
        )}
      </div>
      <div className={navbarToggle ? styles.fadeIn : styles.fadeOut}>
        <div className={styles.mobileLinks}>
          <Link
            href="/blog"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            Blog
          </Link>
          <Link
            href="/chart"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            Chart
          </Link>
          <Link
            href="/claim"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            Claim
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
