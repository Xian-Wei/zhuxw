import Layout from "../../components/Layout";
import LWChart from "../../components/LWChart";
import styles from "./chart.module.scss";
import weightData from "../../json/weight.json";

export default function Chart() {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          Xian-Wei's weight in a daily candlestick chart
        </div>
        <div className={styles.centerContainer}>
          <div className={styles.centerLeftContainer}>
            <LWChart data={weightData} />
          </div>
          <div className={styles.centerRightContainer}>Order book</div>
        </div>
        <div className={styles.bottomContainer}>Up or down</div>
      </div>
    </Layout>
  );
}
