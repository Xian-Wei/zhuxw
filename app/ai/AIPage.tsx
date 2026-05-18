"use client";

import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import styles from "./ai.module.scss";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { IoSend } from "react-icons/io5";

const AIPage = () => {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<null | HTMLTextAreaElement>(null);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (inputRef.current === document.activeElement) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming" || status === "submitted") return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <Layout navbarEnabled={true} footerEnabled={false} backgroundEnabled={true}>
      <div className={styles.container}>
        <div className={styles.chat}>
          <div className={styles.chatLines}>
            {messages.length === 0 ? (
              <div className={styles.empty}>Ask me anything.</div>
            ) : (
              messages.map((m, index) => (
                <div
                  key={index}
                  className={m.role === "user" ? styles.chatLineUser : styles.chatLineAI}
                >
                  <ReactMarkdown>
                    {m.parts
                      .filter(p => p.type === "text")
                      .map(p => (p as { type: "text"; text: string }).text)
                      .join("")}
                  </ReactMarkdown>
                </div>
              ))
            )}
            {isLoading && (
              <div className={styles.chatLineAI}>
                <div className={styles.thinking}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <textarea
              ref={inputRef}
              value={input}
              placeholder="Say something..."
              className={styles.chatInput}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              onFocus={() =>
                setTimeout(() => {
                  inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 200)
              }
            />
            <button
              type="submit"
              className={isLoading ? styles.sendButtonDisabled : styles.sendButton}
              disabled={isLoading}
            >
              <IoSend size={18} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AIPage;
