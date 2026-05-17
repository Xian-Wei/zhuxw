"use client";

import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import styles from "./ai.module.scss";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";

const AIPage = () => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const chatList = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  // Thanks ChatGPT
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const bodyHeight = document.documentElement.clientHeight;

      if (windowHeight < bodyHeight) {
        document.body.style.height = `${windowHeight}px`;
      } else {
        document.body.style.height = "100vh";
      }

      if (inputRef.current === document.activeElement) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    };

    const scrollToInput = () => {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    inputRef.current?.addEventListener("focus", scrollToInput);

    return () => {
      window.removeEventListener("resize", handleResize);
      inputRef.current?.removeEventListener("focus", scrollToInput);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
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
                  <ReactMarkdown>
                    {m.parts
                      .filter(p => p.type === "text")
                      .map(p => (p as { type: "text"; text: string }).text)
                      .join("")}
                  </ReactMarkdown>
                </div>
              ))}
            <div ref={chatList} />
          </div>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <input
              ref={inputRef}
              value={input}
              placeholder="Say something..."
              className={styles.chatInput}
              onChange={e => setInput(e.target.value)}
              onFocus={() =>
                setTimeout(() => {
                  inputRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }, 200)
              }
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AIPage;
