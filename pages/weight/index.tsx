import Layout from "../../components/Layout";
import Chart from "../../components/Chart";
import styles from "./weight.module.scss";
import weightData from "../../json/weight.json";

export default function Weight() {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.topContainer}>a</div>
        <div className={styles.centerContainer}>
          <div className={styles.centerLeftContainer}>b</div>
          <div className={styles.centerMiddleContainer}>
            <Chart data={weightData} />
          </div>
          <div className={styles.centerRightContainer}>c</div>
        </div>
        <div className={styles.bottomContainer}>d</div>
      </div>
    </Layout>
  );
}
