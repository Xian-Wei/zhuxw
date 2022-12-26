export default interface BlogPostProps {
  posts: [
    {
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
  ];
}
