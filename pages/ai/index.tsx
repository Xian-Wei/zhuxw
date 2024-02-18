import React, { useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import styles from "./ai.module.scss";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

const AI = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });
  const chatList = useRef<null | HTMLDivElement>(null);

  const renderMessageContent = (content: string, role: string) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.chat}>
          <div className={styles.chatLines}>
            {messages
              .slice(0)
              .reverse()
              .map((m, index) => (
                <div
                  key={index}
                  className={
                    m.role === "user" ? styles.chatLineUser : styles.chatLineAI
                  }
                >
                  {renderMessageContent(m.content, m.role)}
                </div>
              ))}
            <div ref={chatList} />
          </div>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <input
              value={input}
              placeholder="Say something..."
              className={styles.chatInput}
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AI;
