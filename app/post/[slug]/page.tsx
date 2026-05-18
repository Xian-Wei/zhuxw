import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import type { Metadata } from "next";
import Layout from "../../../components/Layout";
import styles from "./post.module.scss";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!fs.existsSync("posts")) return [];
  return fs.readdirSync("posts").map(fileName => ({
    slug: fileName.replace(".md", ""),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter } = matter(fileName);
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      type: "article",
      images: [{ url: "https://zhuxw.com/images/metalogo.png" }],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={true}>
      <div className={styles.wrapper}>
      <article className={styles.article}>
        <h1>{frontmatter.title}</h1>
        <p className={styles.meta}>{frontmatter.date}</p>
        <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
      </article>
      </div>
    </Layout>
  );
}
