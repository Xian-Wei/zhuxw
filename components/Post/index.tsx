import Link from "next/link";
import BlogPost from "../../models/BlogPost";
import styles from "./post.module.scss";

const Post = ({ slug, frontmatter }: BlogPost) => {
  return (
    <Link href={`/post/${slug}`} className={styles.post}>
      {frontmatter.title}
    </Link>
  );
};

export default Post;
