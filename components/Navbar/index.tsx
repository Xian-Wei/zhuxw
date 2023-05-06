import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./navbar.module.scss";
import useIsWidth from "../../hooks/useIsWidth";
import Web3Wallet from "./Web3Wallet";
import { WindowWidth } from "../../models/WindowWidth";
import Web3Network from "./Web3Network";
import useIsEasterEgg from "../../hooks/useIsEasterEgg";
import { useRouter } from "next/router";

const Navbar = () => {
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
  const isWidth = useIsWidth(WindowWidth.lg);
  const { isDev } = useIsEasterEgg();
  const router = useRouter();

  useEffect(() => {
    if (isWidth) {
      setNavbarToggle(false);
    }
  }, [isWidth]);

  return (
    <nav className={router.pathname == "/" ? styles.navHome : styles.nav}>
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
        <Link href="/about" className={styles.link}>
          About
        </Link>
        <Link href="/blog" className={styles.link}>
          Blog
        </Link>
        <Link href="/web3" className={styles.link}>
          Web3
        </Link>
        {isDev && (
          <Link href="/dev" className={styles.link}>
            Dev
          </Link>
        )}
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
            href="/about"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            About
          </Link>
          <Link
            href="/blog"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            Blog
          </Link>
          <Link
            href="/web3"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            Web3
          </Link>
          {isDev && (
            <Link href="/dev" className={styles.mobileLink}>
              Dev
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
