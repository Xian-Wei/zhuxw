import Link from "next/link";
import styles from "./navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftContainer}>
        <Link href="/" className={styles.link}>
          Logo
        </Link>
      </div>
      <div className={styles.middleContainer}>
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/blog" className={styles.link}>
          Blog
        </Link>
        <Link href="/weight" className={styles.link}>
          Weight
        </Link>
      </div>
      <div className={styles.rightContainer}>
        <Link href="/" className={styles.buttonLink}>
          Logo
        </Link>
      </div>
    </nav>
  );
}
