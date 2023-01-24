import { useEffect, useState } from "react";
import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";
import styles from "./Blog.module.scss";

import Post from "../../models/Post";
import Layout from "../../components/Layout";
import BlogCard from "../../components/BlogCard";
import BlogPost from "../../components/BlogPost";
import BlogPostTag from "../../components/BlogPostTag";
import BlogPostTagState from "../../models/BlogPostTagState";

interface PostProps {
  posts: Post[];
}

export const siteTitle = "Xian-Wei's blog";

export default function Blog({ posts }: PostProps) {
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tagStates, setTagStates] = useState<BlogPostTagState[]>([]);
  const [firstFilter, setFirstFilter] = useState<boolean>(true);

  // Text search
  const onSearch = (search: string) => {
    let newSearchedPosts: Post[] = [];

    if (search != "") {
      newSearchedPosts = posts?.filter((post) =>
        post.frontmatter.title.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      newSearchedPosts = posts;
    }

    setSearchedPosts(newSearchedPosts);
  };

  // Tag toggle function
  // By default all tags are enabled
  // The first time a tag is clicked on, all other tags will be disabled
  const toggleTag = (name: string) => {
    let newTagStates: BlogPostTagState[] = [...tagStates];
    let index = tagStates.findIndex((tag) => tag.name === name);

    if (firstFilter) {
      newTagStates.forEach((tagState) => (tagState.enabled = false));
      setFirstFilter(false);
    }

    newTagStates[index].enabled = !newTagStates[index].enabled;

    setTagStates(newTagStates);
  };

  // Gets tags from all posts
  const setAllTags = (posts: Post[]) => {
    let tempTagStates: BlogPostTagState[] = [];

    posts.forEach((post) => {
      post.frontmatter.tags.forEach((tagName) => {
        if (!tempTagStates.some((tagState) => tagState.name === tagName)) {
          tempTagStates.push({ name: tagName, enabled: true });
        }
      });
    });

    setTagStates(tempTagStates);
  };

  // Initializes everything on load
  useEffect(() => {
    setSearchedPosts(posts);
    setFilteredPosts(posts);
    setAllTags(posts);
  }, [posts]);

  // Filters every time there's an input or a tag toggle
  useEffect(() => {
    const onFilter = () => {
      let newFilteredPosts: Post[] = [];

      for (let i = 0; i < searchedPosts?.length; i++) {
        loop2: for (
          let j = 0;
          j < searchedPosts[i].frontmatter.tags.length;
          j++
        ) {
          for (let k = 0; k < tagStates.length; k++) {
            if (
              searchedPosts[i].frontmatter.tags[j] === tagStates[k].name &&
              tagStates[k].enabled
            ) {
              newFilteredPosts.push(searchedPosts[i]);
              break loop2;
            }
          }
        }
      }

      setFilteredPosts(newFilteredPosts);
    };
    onFilter();
  }, [searchedPosts, tagStates]);

  return (
    <Layout navbarEnabled={true} footerEnabled={true}>
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
        {posts
          ?.slice(0, 4)
          .reverse()
          .map((post) => (
            <BlogCard
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
              {filteredPosts
                ?.slice()
                .reverse()
                .map((post) => (
                  <BlogPost
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
                  onSearch(e.target.value);
                }}
              />
            </div>
            <div className={styles.filterSubContainer}>
              <div className={styles.filterTitle}>Tags</div>
              <div className={styles.tags}>
                {tagStates.length > 0 &&
                  tagStates?.map((tagState) => (
                    <BlogPostTag
                      tagState={tagState}
                      toggle={() => toggleTag(tagState.name)}
                      key={tagState.name}
                    />
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
  const posts: Post[] = files.map((fileName) => {
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
