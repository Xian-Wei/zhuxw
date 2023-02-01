import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.scss";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="og:title" content={siteTitle} />
        <meta
          name="og:description"
          content="Hi I'm Xian-Wei, wannabe web3 builder at @XianWeiCorp. Don't expect anything from this website. I'm drinking tea as I'm typing this. I'm just trying to have a nice and long description. Yes."
        />
        <meta
          property="og:image"
          content={`https://zhuxw.com/images/comedy.png`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>Home</main>
    </Layout>
  );
}
