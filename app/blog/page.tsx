import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import Post from "../../models/Post";

export const metadata: Metadata = {
  title: "zhuxw blog",
  description:
    "Welcome to my blog, where I attempt to write in a way that doesn't put you to sleep.",
  openGraph: {
    images: [{ url: "https://zhuxw.com/images/metalogo.png" }],
  },
};

export default function BlogPage() {
  const files = fs.readdirSync("posts");
  const posts: Post[] = files.map(fileName => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter }: any = matter(readFile);
    return {
      slug,
      frontmatter: {
        ...frontmatter,
        date:
          frontmatter.date instanceof Date
            ? frontmatter.date.toISOString().split("T")[0]
            : String(frontmatter.date),
      },
    };
  });

  posts.sort((a, b) => {
    if (a.frontmatter.id < b.frontmatter.id) return -1;
    if (a.frontmatter.id > b.frontmatter.id) return 1;
    return 0;
  });

  return <BlogClient posts={posts} />;
}
