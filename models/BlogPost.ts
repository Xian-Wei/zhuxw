export default interface BlogPost {
  slug: string;
  frontmatter: {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    tags: [];
  };
}
