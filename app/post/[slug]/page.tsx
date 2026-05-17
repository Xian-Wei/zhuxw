import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import type { Metadata } from "next";
import Layout from "../../../components/Layout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const files = fs.readdirSync("posts");
  return files.map(fileName => ({
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
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
      <article className="prose prose-invert mx-auto py-10 px-5">
        <h1>{frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
      </article>
    </Layout>
  );
}
