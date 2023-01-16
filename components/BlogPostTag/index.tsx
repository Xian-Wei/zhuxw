import BlogPostTagState from "../../models/BlogPostTagState";
import styles from "./posttag.module.scss";

interface BlogPostTagProps {
  tagState: BlogPostTagState;
  toggle: () => void;
}

const BlogPostTag = ({ tagState, toggle }: BlogPostTagProps) => {
  return (
    <div
      className={tagState.enabled ? styles.tagEnabled : styles.tagDisabled}
      onClick={() => toggle()}
    >
      {tagState.name}
    </div>
  );
};

export default BlogPostTag;
