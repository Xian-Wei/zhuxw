"use client";

import { useEffect, useState } from "react";
import styles from "./Blog.module.scss";
import Post from "../../models/Post";
import Layout from "../../components/Layout";
import BlogPost from "../../components/Blog/BlogPost";
import BlogPostTag from "../../components/Blog/BlogPostTag";
import BlogPostTagState from "../../models/BlogPostTagState";
interface PostProps {
  posts: Post[];
}

export default function BlogClient({ posts }: PostProps) {
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tagStates, setTagStates] = useState<BlogPostTagState[]>([]);
  const [firstFilter, setFirstFilter] = useState<boolean>(true);

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
      <div className={styles.wrapper}>
      <div className={styles.container}>
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
      </div>
      </div>
    </Layout>
  );
}
