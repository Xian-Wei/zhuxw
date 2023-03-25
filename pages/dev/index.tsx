import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import { connect, disconnect } from "../../store/slices/authSlice";
import { RootState } from "../../store/store";

import styles from "./dev.module.scss";

const Dev = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Login");
  const isLogin = useSelector((state: RootState) => state.auth.login);
  const dispatch = useDispatch();
  const pages = isLogin ? ["Contract"] : ["Login", "Register"];

  useEffect(() => {
    if (!isLogin) {
      setSelectedPage("Login");
    } else {
      setSelectedPage("Contract");
    }
  }, [isLogin]);

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
    const [statusMessage, setStatusMessage] = useState("");

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
        setStatusMessage("Success!");
        dispatch(connect());
      } catch (e: any) {
        console.log(e);

        try {
          if (e.response.data.errors) {
            setStatusMessage("Your credentials are invalid.");
          } else if (e.response.data) {
            setStatusMessage(e.response.data);
          }
        } catch (e) {
          setStatusMessage("Server is not responding.");
        }
      }
    };

    return (
      <form className={styles.formContainer} onSubmit={(e) => login(e)}>
        <div>Login</div>
        <div>{statusMessage}</div>
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
    const [statusMessage, setStatusMessage] = useState("");

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
        setStatusMessage("Success!");
      } catch (e: any) {
        console.log(e);

        try {
          if (e.response.data.errors) {
            setStatusMessage("Your credentials are invalid.");
          } else if (e.response.data) {
            setStatusMessage(e.response.data);
          }
        } catch (e) {
          setStatusMessage("Server is not responding.");
        }
      }
    };

    return (
      <form className={styles.formContainer} onSubmit={(e) => register(e)}>
        <div>Register</div>
        <div>{statusMessage}</div>
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
    return (
      <div>
        <div>Contract</div>
        <br />
        <div onClick={() => dispatch(disconnect())}>Logout</div>
      </div>
    );
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
