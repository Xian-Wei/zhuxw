import { useEffect, useState } from "react";
import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";

import styles from "./Blog.module.scss";
import Post from "../../models/Post";
import Layout from "../../components/Layout";
import BlogPost from "../../components/Blog/BlogPost";
import BlogPostTag from "../../components/Blog/BlogPostTag";
import BlogPostTagState from "../../models/BlogPostTagState";
import MetaTags from "../../components/MetaTags";
import useIsEasterEgg from "../../hooks/useIsEasterEgg";

interface PostProps {
  posts: Post[];
}

export const siteTitle = "zhuxw blog";

export default function Blog({ posts }: PostProps) {
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tagStates, setTagStates] = useState<BlogPostTagState[]>([]);
  const [firstFilter, setFirstFilter] = useState<boolean>(true);
  const { isDev } = useIsEasterEgg();

  const onSearch = (search: string) => {
    if (search !== "") {
      setSearchedPosts(
        posts?.filter(post =>
          post.frontmatter.title.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setSearchedPosts(posts);
    }
  };

  const toggleTag = (name: string) => {
    let newTagStates = [...tagStates];
    const index = tagStates.findIndex(tag => tag.name === name);

    if (firstFilter) {
      newTagStates.forEach(t => (t.enabled = false));
      setFirstFilter(false);
    }

    newTagStates[index].enabled = !newTagStates[index].enabled;
    setTagStates(newTagStates);
  };

  const setAllTags = (posts: Post[]) => {
    const tempTagStates: BlogPostTagState[] = [];
    posts.forEach(post => {
      post.frontmatter.tags.forEach(tagName => {
        if (!tempTagStates.some(t => t.name === tagName)) {
          tempTagStates.push({ name: tagName, enabled: true });
        }
      });
    });
    setTagStates(tempTagStates);
  };

  useEffect(() => {
    setSearchedPosts(posts);
    setFilteredPosts(posts);
    setAllTags(posts);
  }, [posts]);

  useEffect(() => {
    const newFilteredPosts: Post[] = [];
    for (const post of searchedPosts ?? []) {
      loop2: for (const tag of post.frontmatter.tags) {
        for (const tagState of tagStates) {
          if (tag === tagState.name && tagState.enabled) {
            newFilteredPosts.push(post);
            break loop2;
          }
        }
      }
    }
    setFilteredPosts(newFilteredPosts);
  }, [searchedPosts, tagStates]);

  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Welcome to my blog, where I attempt to write in a way that doesn't put you to sleep."
          }
          url={"https://zhuxw.com/blog"}
        />
      </Head>
      <div className={styles.container}>
        {isDev && (
          <>
            <div className={styles.filters}>
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                onChange={e => onSearch(e.target.value)}
              />
              {tagStates.length > 0 && (
                <div className={styles.tags}>
                  {tagStates.map(tagState => (
                    <BlogPostTag
                      tagState={tagState}
                      toggle={() => toggleTag(tagState.name)}
                      key={tagState.name}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={styles.posts}>
              {filteredPosts?.length > 0 ? (
                filteredPosts
                  .slice()
                  .reverse()
                  .map(post => (
                    <BlogPost
                      key={post.frontmatter.id}
                      slug={post.slug}
                      frontmatter={post.frontmatter}
                    />
                  ))
              ) : (
                <div className={styles.empty}>No posts yet.</div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync("posts");
  const posts: Post[] = files.map(fileName => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`posts/${fileName}`, "utf-8");
    const { data: frontmatter }: any = matter(readFile);
    return { slug, frontmatter: { ...frontmatter, date: frontmatter.date instanceof Date ? frontmatter.date.toISOString().split("T")[0] : String(frontmatter.date) } };
  });

  posts.sort((a, b) => {
    if (a.frontmatter.id < b.frontmatter.id) return -1;
    if (a.frontmatter.id > b.frontmatter.id) return 1;
    return 0;
  });

  return { props: { posts } };
}
