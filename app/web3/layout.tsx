import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import styles from "./web3.module.scss";

const pages = [
  { label: "Chart", href: "/web3/chart" },
  { label: "Shop", href: "/web3/shop" },
  { label: "FAQ", href: "/web3/web3faq" },
];

export default function Web3Layout({ children }: { children: React.ReactNode }) {
  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <Sidebar pages={pages} />
        <div className={styles.content}>{children}</div>
      </div>
    </Layout>
  );
}
