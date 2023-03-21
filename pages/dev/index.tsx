import axios from "axios";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import styles from "./dev.module.scss";

const pages = ["Login", "Register", "Contract"];

const Dev = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Login");

  const renderPage = () => {
    switch (selectedPage) {
      case "Login":
        return <LoginPage />;
      case "Register":
        return <RegisterPage />;
      case "Contract":
        return <ContractPage />;

      default:
        break;
    }
  };

  const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusCode, setStatusCode] = useState("");

    const onUsernameChange = (username: string) => {
      setUsername(username);
    };

    const onPasswordChange = (password: string) => {
      setPassword(password);
    };

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const result = await axios.post(
          "https://localhost:5000/api/auth/login",
          {
            username: username,
            password: password,
          }
        );
        console.log(result);
        setStatusCode("Success!");
      } catch (e: any) {
        console.log(e);
        setStatusCode(e.response.data);
      }
    };

    return (
      <form className={styles.formContainer} onSubmit={(e) => login(e)}>
        <div>Login</div>
        <div>{statusCode}</div>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
        />
        <input
          type="text"
          className={styles.formInput}
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <button className={styles.submitButton}>Login</button>
      </form>
    );
  };

  const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusCode, setStatusCode] = useState("");

    const onUsernameChange = (username: string) => {
      setUsername(username);
    };

    const onPasswordChange = (password: string) => {
      setPassword(password);
    };

    const register = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const result = await axios.post(
          "https://localhost:5000/api/auth/register",
          {
            username: username,
            password: password,
          }
        );
        console.log(result);
        setStatusCode("Success!");
      } catch (e: any) {
        setStatusCode(e.response.data);
      }
    };

    return (
      <form className={styles.formContainer} onSubmit={(e) => register(e)}>
        <div>Register</div>
        <div>{statusCode}</div>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
        />
        <input
          type="text"
          className={styles.formInput}
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <button className={styles.submitButton}>Login</button>
      </form>
    );
  };

  const ContractPage = () => {
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
