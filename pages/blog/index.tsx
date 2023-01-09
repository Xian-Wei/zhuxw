import { useEffect, useState } from "react";
import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";
import styles from "./Blog.module.scss";

import Card from "../../components/Card";
import Layout from "../../components/Layout";
import Post from "../../components/Post";
import BlogPost from "../../models/BlogPost";

interface BlogPostProps {
  posts: BlogPost[];
}

export const siteTitle = "Xian-Wei's blog";

export default function Blog({ posts }: BlogPostProps) {
  const [sortedPosts, setSortedPosts] = useState<BlogPost[]>();
  const [tags, setTags] = useState<String[]>();

  const onSearch = (e: any) => {
    if (e.target.value != "") {
      let newSortedPosts: BlogPost[] | undefined = posts?.filter((post) =>
        post.frontmatter.title
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setSortedPosts(newSortedPosts);
    } else {
      setSortedPosts(posts);
    }
  };

  const setAllTags = (posts: BlogPost[]) => {
    let tempTags: String[] = [];

    posts.forEach((post) => {
      post.frontmatter.tags.forEach((tag) => {
        if (!tempTags.includes(tag)) {
          tempTags.push(tag);
        }
      });
    });

    setTags(tempTags);
  };

  useEffect(() => {
    setSortedPosts(posts);
    setAllTags(posts);
  }, [posts]);

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content="This is Xian-Wei's very personal blog, enter at your own risk."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content={`https://upload-os-bbs.hoyolab.com/upload/2022/05/25/24882171/ea53f903a1b5db7b585594b12ad59baf_9035185298557925351.png`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={styles.highlighted}>
        {posts?.slice(0, 4).map((post) => (
          <Card
            key={post.frontmatter.id}
            slug={post.slug}
            image={post.frontmatter.image}
            title={post.frontmatter.title}
            tags={post.frontmatter.tags}
          />
        ))}
      </div>
      <div className={styles.container}>
        <div className={styles.subcontainer}>
          <div className={styles.postContainer}>
            <div className={styles.postTitle}>Recent posts</div>
            <div className={styles.posts}>
              {sortedPosts?.map((post) => (
                <Post
                  key={post.frontmatter.id}
                  slug={post.slug}
                  frontmatter={post.frontmatter}
                />
              ))}
            </div>
          </div>
          <div className={styles.filters}>
            <div className={styles.filterSubContainer}>
              <div className={styles.filterTitle}>Search</div>
              <input
                type="text"
                className={styles.searchInput}
                onChange={(e) => {
                  onSearch(e);
                }}
              />
            </div>
            <div className={styles.filterSubContainer}>
              <div className={styles.filterTitle}>Tags</div>
              <div className={styles.tags}>
                {tags?.map((tag) => (
                  <div className={styles.tag} key={tag as string}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync("posts");
  const posts: BlogPost[] = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter }: any = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}
