import { FaTwitter, FaGithub, FaReddit } from "react-icons/fa";

import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
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
      <div className={styles.copyright}>&copy; 2025 Xian-Wei Zhu</div>
    </footer>
  );
};

export default Footer;
