import Image from "next/image";
import Link from "next/link";
import Post from "../../../models/Post";
import styles from "./post.module.scss";

const BlogPost = ({ slug, frontmatter }: Post) => {
  return (
    <Link href={`/post/${slug}`} className={styles.post}>
      <div className={styles.imageContainer}>
        <div className={styles.image}>
          <Image
            width={200}
            height={200}
            alt={frontmatter.title}
            src={`/${frontmatter.image}`}
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.title}>{frontmatter.title}</div>
        <div className={styles.description}>{frontmatter.description}</div>
        <div className={styles.bottomInfo}>
          <div className={styles.tags}>
            {frontmatter.tags.map(tag => (
              <div className={styles.tag} key={tag}>
                {tag}
              </div>
            ))}
          </div>
          <div className={styles.date}>{frontmatter.date}</div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPost;
