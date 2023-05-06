import Head from "next/head";
import React from "react";
import styles from "./about.module.scss";
import MetaTags from "../../components/MetaTags";
import Layout from "../../components/Layout";

export const siteTitle = "Xian-Wei Zhu";

const About = () => {
  return (
    <Layout navbarEnabled={true} footerEnabled={true}>
      <Head>
        <title>{siteTitle}</title>
        <MetaTags
          title={siteTitle}
          description={"Who the great Xian-Wei Zhu is."}
          url={"https://zhuxw.com/about"}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>About Xian-Wei Zhu and zhuxw</div>
          <div className={styles.text}>
            <div className={styles.paragraphTitle}>Who am I ?</div>
            <div className={styles.paragraph}>
              <div className={styles.block}>
                You may call me Pitch-Dark Xian-Wei the Great.
              </div>
              <div className={styles.block}>
                I was born in Belgium in the year 1999, in the month of January,
                on the 2nd.
              </div>
              <div className={styles.block}>
                I aspire to be the next Elon Musk like all wantrepreneurs out
                there.
              </div>
            </div>
            <div className={styles.paragraphTitle}>
              List of projects and achievements
            </div>
            <div className={styles.paragraph}>Yes.</div>
            <div className={styles.paragraphTitle}>
              The purpose of this website
            </div>
            <div className={styles.paragraph}>
              <div className={styles.block}>
                There is another individual who shares my name, a successful
                50-something German artist who has achieved many incredible
                things, unlike me.
              </div>
              <div className={styles.block}>
                On top of overshadowing me in life, he&apos;s taking over the
                Google search results for our name.
              </div>
              <div className={styles.block}>
                I shall not let things go his way.
              </div>
              <div className={styles.block}>
                From now on, my life goal is to surpass him in every way
                possible and make my own mark on the world.
              </div>
              <div className={styles.block}>
                Unfortunately, as of today, his website{" "}
                <a className={styles.link} href="https://www.xianwei-zhu.com/">
                  www.xianwei-zhu.com
                </a>{" "}
                is ranked first. <br />
              </div>
              <div className={styles.block}>
                But mark my words when I say that his reign is almost over.
              </div>
              <div className={styles.block}>
                A new era for Xian-Wei Zhu will come, and the throne will be
                mine to claim.
              </div>
            </div>
            <div className={styles.paragraphTitle}>Development</div>
            <div className={styles.paragraph}>
              <div className={styles.block}>
                There is a test page that shows up on the navbar when you type
                CACA on your keyboard or when you tap simultaneously with 2
                fingers on your mobile device.
              </div>
              <div className={styles.block}>
                Anything that shows up in there will likely not work, I&apos;m
                just typing this out to fill the space in my About section.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
