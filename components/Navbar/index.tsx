import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./navbar.module.scss";
import useIsMobile from "../../hooks/useIsMobile";
import Web3Wallet from "../Web3Wallet";

const Navbar = () => {
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setNavbarToggle(false);
    }
  }, [isMobile]);

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
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/blog" className={styles.link}>
          Blog
        </Link>
        <Link href="/chart" className={styles.link}>
          Chart
        </Link>
      </div>
      <div className={styles.rightContainer}>
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
            href="/"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            Home
          </Link>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
