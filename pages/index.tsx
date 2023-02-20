import Head from "next/head";
import Layout from "../components/Layout";
import MetaTags from "../components/MetaTags";
import styles from "../styles/Home.module.scss";

export const siteTitle = "Xian-Wei Zhu";

export default function Home() {
  return (
    <Layout navbarEnabled={true} footerEnabled={true} backgroundEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={
            "Hi I'm Xian-Wei Zhu, wannabe web3 builder and wantrepreneur at @XianWeiCorp. Don't expect anything from this website. I'm drinking tea as I'm typing this. I'm just trying to have a nice long description. Yes."
          }
          url={"https://zhuxw.com/"}
        />
      </Head>
      <main className={styles.main}>Home</main>
    </Layout>
  );
}
