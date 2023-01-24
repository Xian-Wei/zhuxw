import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.scss";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
  return (
    <Layout navbarEnabled={true} footerEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content="Hi I'm Xian-Wei, wannabe web3 builder at @XianWeiCorp. Don't expect anything from this website."
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
      <main className={styles.main}>Home</main>
    </Layout>
  );
}
