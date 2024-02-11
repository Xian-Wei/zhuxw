import React, { useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import styles from "./ai.module.scss";
import { useChat } from "ai/react";

const AI = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });
  const chatList = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    chatList.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessageContent = (content: string, role: string) => {
    if (role != "user") {
      return content.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));
    } else {
      return content;
    }
  };

  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.chat}>
          <div className={styles.chatLines}>
            {messages.map(m => (
              <div
                key={m.id}
                className={
                  m.role === "user" ? styles.chatLine : styles.chatLineAi
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
