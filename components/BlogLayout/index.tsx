import styles from "./bloglayout.module.scss";

export default function BlogLayout({ children }: any) {
  return <div className={styles.layout}>{children}</div>;
}
