import React, { useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import styles from "./dev.module.scss";

const pages = ["Login", "Contract"];

const Dev = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Login");

  const renderPage = () => {
    switch (selectedPage) {
      case "Login":
        return <Login />;
      case "Contract":
        return <Contract />;
      default:
        break;
    }
  };

  const Login = () => {
    return <div>Login</div>;
  };

  const Contract = () => {
    return <div>Contract</div>;
  };

  return (
    <Layout navbarEnabled={true}>
      <div className={styles.container}>
        <Sidebar pages={pages} setPage={setSelectedPage} />
        <div className={styles.content}>{renderPage()}</div>
      </div>
    </Layout>
  );
};

export default Dev;
