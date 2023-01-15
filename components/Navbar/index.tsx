import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./navbar.module.scss";
import useIsMobile from "../../hooks/useIsMobile";

const Navbar = () => {
  const [navbarToggle, setNavbarToggle] = useState<boolean>(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setNavbarToggle(false);
    }
  }, [isMobile]);

  return (
    <nav className={styles.nav}>
      <div className={styles.leftContainer}>
        <Link href="/" className={styles.homeLink}>
          zhuxw
        </Link>
      </div>
      <div className={styles.middleContainer}>
        <Link
          href="/"
          className={styles.link}
          onClick={() => setNavbarToggle(false)}
        >
          Home
        </Link>
        <Link
          href="/blog"
          className={styles.link}
          onClick={() => setNavbarToggle(false)}
        >
          Blog
        </Link>
        <Link
          href="/chart"
          className={styles.link}
          onClick={() => setNavbarToggle(false)}
        >
          Chart
        </Link>
      </div>
      <div className={styles.rightContainer}>
        <Link
          href="/"
          className={styles.buttonLink}
          onClick={() => setNavbarToggle(false)}
        >
          Start app
        </Link>
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
      <div className={navbarToggle ? styles.mobileLinks : styles.hidden}>
        <Link href="/" className={styles.mobileLink}>
          Home
        </Link>
        <Link href="/blog" className={styles.mobileLink}>
          Blog
        </Link>
        <Link href="/chart" className={styles.mobileLink}>
          Chart
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
