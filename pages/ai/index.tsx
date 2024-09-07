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
  const inputRef = useRef<null | HTMLInputElement>(null);

  // Thanks ChatGPT
  useEffect(() => {
    const handleResize = () => {
      // Adjust body height to account for keyboard visibility
      const windowHeight = window.innerHeight;
      const bodyHeight = document.documentElement.clientHeight;

      // If window height is smaller, keyboard is likely open
      if (windowHeight < bodyHeight) {
        document.body.style.height = `${windowHeight}px`;
      } else {
        document.body.style.height = "100vh";
      }

      if (inputRef.current === document.activeElement) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center", // Center the input in the view
          });
        }, 100); // Small delay for the keyboard to appear
      }
    };

    // Focus event: Scroll the input into view when it gains focus
    const scrollToInput = () => {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300); // Delay to wait for the keyboard to appear
    };

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Attach the focus event listener to the input
    inputRef.current?.addEventListener("focus", scrollToInput);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
      inputRef.current?.removeEventListener("focus", scrollToInput);
    };
  }, []); // Run only on mount and unmount

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
                  <ReactMarkdown>{m.content}</ReactMarkdown>
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
              onChange={handleInputChange}
              // Ensure input field is visible when focused
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

export default AI;
