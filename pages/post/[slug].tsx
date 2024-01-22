import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import Head from "next/head";
import Layout from "../../components/Layout";
import MetaTags from "../../components/MetaTags";
import Image from "next/image";

export default function PostPage({ slug, frontmatter, content }: any) {
  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={false}>
      <Head>
        <title>{frontmatter.title}</title>
        <MetaTags
          title={frontmatter.title}
          description={frontmatter.description}
          url={`https://zhuxw.com/post/${slug}`}
          type="article"
        />
      </Head>
      <div className="prose prose-invert mx-auto py-10 px-5">
        <h1>{frontmatter.title}</h1>
        <Image
          width={600}
          height={600}
          alt={frontmatter.title}
          src={`/${frontmatter.image}`}
        />
        <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map(fileName => ({
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
      slug,
      frontmatter,
      content,
    },
  };
}
