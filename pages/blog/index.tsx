import fs from "fs";
import matter from "gray-matter";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import BlogLayout from "../../components/BlogLayout";
import Layout from "../../components/Layout";
import BlogPostProps from "../../models/BlogPostProps";

export const siteTitle = "Xian-Wei's blog";

export default function Blog({ posts }: BlogPostProps) {
  return (
    <Layout>
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
      <BlogLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0">
          {posts?.map((post) => (
            <Link
              href={`/post/${post.slug}`}
              data-mdb-ripple="true"
              key={post.frontmatter.id}
            >
              <div className="flex justify-center rounded-lg">
                <div className="rounded-lg shadow-lg bg-white max-w-sm mx-3 mt-6 mb-4 relative overflow-hidden bg-no-repeat bg-cover max-w-xs border border-slate-200">
                  <Image
                    width={400}
                    height={250}
                    alt={post.frontmatter.title}
                    src={`/${post.frontmatter.image}`}
                    className="rounded-t-lg"
                  />
                  <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 hover:opacity-10 transition duration-300 ease-in-out bg-gray-500"></div>
                  <div className="px-6 pt-6 pb-2">
                    <h5 className="text-gray-900 text-xl font-medium mb-2">
                      {post.frontmatter.title}
                    </h5>
                    <p className="text-gray-700 text-base mb-4">
                      {post.frontmatter.description}
                    </p>
                    <div className="pt-2 pb-4">
                      {post.frontmatter.tags.map((tag) => {
                        return (
                          <span
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                            key={tag}
                          >
                            {"#" + tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </BlogLayout>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync("posts");
  const posts = files.map((fileName) => {
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
