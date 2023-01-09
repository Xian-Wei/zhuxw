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
    <Link href={`/post/${slug}`}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            width={400}
            height={250}
            alt={title}
            src={`/${image}`}
            className={styles.image}
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.title}> Card</div>
          <div className={styles.tags}>
            {tags?.map((tag) => {
              return <div className={styles.tag}>{tag}</div>;
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
