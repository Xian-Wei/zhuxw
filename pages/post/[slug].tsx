import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Head from "next/head";
import Layout from "../../components/Layout";

export default function PostPage({ frontmatter, content }: any) {
  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
      <Head>
        <title>{frontmatter.title}</title>
        <meta name="og:title" content={frontmatter.title} />
        <meta name="og:description" content={frontmatter.description} />
        <meta
          property="og:image"
          content={`https://zhuxw.com/images/comedy.png`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="prose prose-invert mx-auto py-10 px-5">
        <h1>{frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }: any) {
  const fileName = fs.readFileSync(`posts/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}
