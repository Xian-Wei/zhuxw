import styles from "./bloglayout.module.scss";

const BlogLayout = ({ children }: any) => {
  return <div className={styles.layout}>{children}</div>;
};

export default BlogLayout;
