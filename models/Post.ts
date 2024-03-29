export default interface Post {
  slug: string;
  frontmatter: {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    tags: string[];
  };
}
