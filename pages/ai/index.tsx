import React from "react";
import Layout from "../../components/Layout";
import styles from "./ai.module.scss";
import { useChat } from "ai/react";

const AI = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.chat}>
          {messages.map((m) => (
            <div key={m.id} className={styles.conversation}>
              {m.role}: {m.content}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <input
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AI;
