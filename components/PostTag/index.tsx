import TagState from "../../models/TagState";
import styles from "./posttag.module.scss";

interface PostTagProps {
  tagState: TagState;
  toggle: () => void;
}

const PostTag = ({ tagState, toggle }: PostTagProps) => {
  return (
    <div
      className={tagState.enabled ? styles.tagEnabled : styles.tagDisabled}
      onClick={() => toggle()}
    >
      {tagState.name}
    </div>
  );
};

export default PostTag;
