import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.scss";

interface CardProps {
  slug: string;
  image: string;
  title: string;
  tags: string[];
}

const Card = ({ slug, image, title, tags }: CardProps) => {
  return (
    <div className={styles.container}>
      <Link href={`/post/${slug}`}>
        <div className={styles.imageContainer}>
          <Image
            width={400}
            height={400}
            alt={title}
            src={`/${image}`}
            className={styles.image}
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.title}>{title}</div>
          <div className={styles.tags}>
            {tags?.map((tag) => {
              return (
                <div className={styles.tag} key={tag}>
                  {tag}
                </div>
              );
            })}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
