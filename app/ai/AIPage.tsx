"use client";

import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import styles from "./ai.module.scss";
import ReactMarkdown from "react-markdown";
import { IoSend } from "react-icons/io5";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    inputRef.current?.blur();
    setIsLoading(true);

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className={styles.chatLineAI}>
                <div className={styles.thinking}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className={styles.chatForm}>
            <textarea
              ref={inputRef}
              value={input}
              placeholder="Say something..."
              className={styles.chatInput}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); handleSubmit(); }}
              className={isLoading ? styles.sendButtonDisabled : styles.sendButton}
              disabled={isLoading}
            >
              <IoSend size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIPage;
