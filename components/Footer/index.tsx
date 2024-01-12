import { FaTwitter, FaGithub, FaReddit } from "react-icons/fa";

import styles from "./footer.module.scss";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  return (
    <footer
      className={
        router.pathname == "/about" ? styles.footerBorder : styles.footer
      }
    >
      <div className={styles.iconContainer}>
        <a href="https://twitter.com/xianweizhu" className={styles.icon}>
          <FaTwitter />
        </a>
        <a href="https://github.com/Xian-Wei" className={styles.icon}>
          <FaGithub />
        </a>
        <a href="https://reddit.com/u/xianweizhu" className={styles.icon}>
          <FaReddit />
        </a>
      </div>
      <div className={styles.copyright}>&copy; 2023 Xian-Wei Zhu</div>
    </footer>
  );
};

export default Footer;
