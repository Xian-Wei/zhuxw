import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./navbar.module.scss";
import useIsWidth from "../../hooks/useIsWidth";
import Web3Wallet from "./Web3Wallet";
import { WindowWidth } from "../../models/WindowWidth";
import Web3Network from "./Web3Network";
import useIsEasterEgg from "../../hooks/useIsEasterEgg";
import Image from "next/image";

const Navbar = () => {
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
  const isWidth = useIsWidth(WindowWidth.lg);
  const { isDev } = useIsEasterEgg();

  useEffect(() => {
    if (isWidth) {
      setNavbarToggle(false);
    }
  }, [isWidth]);

  return (
    <header className={styles.nav}>
      <nav className={styles.leftContainer}>
        <Link
          href="/"
          className={styles.homeLink}
          onClick={() => setNavbarToggle(false)}
        >
          <Image
            src="/images/metalogo.png"
            height={80}
            width={80}
            alt="zhuxw logo"
          />
        </Link>
      </nav>
      <nav className={styles.middleContainer}>
        <Link href="/about" className={styles.link}>
          About
        </Link>
        <Link href="/blog" className={styles.link}>
          Blog
        </Link>
        <Link href="/web3" className={styles.link}>
          Web3
        </Link>
        <Link href="/ai" className={styles.link}>
          AI
        </Link>
        {isDev && (
          <Link href="/dev" className={styles.link}>
            Dev
          </Link>
        )}
      </nav>
      <nav className={styles.rightContainer}>
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
      </nav>
      <nav className={navbarToggle ? styles.fadeIn : styles.fadeOut}>
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
          <Link
            href="/ai"
            className={styles.mobileLink}
            onClick={() => setNavbarToggle(false)}
          >
            AI
          </Link>
          {isDev && (
            <Link href="/dev" className={styles.mobileLink}>
              Dev
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
