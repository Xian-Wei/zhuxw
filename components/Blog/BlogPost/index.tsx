import Link from "next/link";
import Post from "../../../models/Post";
import styles from "./post.module.scss";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const BlogPost = ({ slug, frontmatter }: Post) => {
  return (
    <Link href={`/post/${slug}`} className={styles.post}>
      <div className={styles.header}>
        <div className={styles.title}>{frontmatter.title}</div>
        <div className={styles.date}>{formatDate(frontmatter.date)}</div>
      </div>
      <div className={styles.description}>{frontmatter.description}</div>
      <div className={styles.tags}>
        {frontmatter.tags.map(tag => (
          <div className={styles.tag} key={tag}>
            {tag}
          </div>
        ))}
      </div>
    </Link>
  );
};

export default BlogPost;
