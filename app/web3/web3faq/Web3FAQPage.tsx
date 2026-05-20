"use client";

import React, { useState } from "react";
import styles from "./web3faq.module.scss";

interface FAQItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className={styles.item}>
      <button className={styles.itemTitle} onClick={onToggle}>
        <span>{title}</span>
        <span className={isOpen ? styles.chevronOpen : styles.chevron}>›</span>
      </button>
      {isOpen && <div className={styles.itemContent}>{content}</div>}
    </div>
  );
};

const faqData = [
  {
    title: "What is this?",
    content: "My own trading system built on the blockchain.",
  },
  {
    title: "What do I trade?",
    content:
      "Bet on whether I gain or lose weight each week, using my own cryptocurrency $ZHU.",
  },
  {
    title: "What do I need to start trading?",
    content:
      "An Ethereum wallet, I recommend using Metamask, Rabby, or the integrated wallet in the Brave Browser.",
  },
  {
    title: "How do I get $ZHU?",
    content:
      "Click on the faucet button located next to the trade button to receive free $ZHU.",
  },
  {
    title: "Why?",
    content: "To be able to claim my very own NFT collection in the Shop section.",
  },
  {
    title: "What is the Zhuba NFT Gacha?",
    content:
      "Spend 10,000 $ZHU to receive a Zhuba NFT of random rarity. There are 5 tiers — most are common, a few are not.",
  },
  {
    title: "How does it work under the hood?",
    content:
      "The trading contracts are written in Solidity. Chainlink handles the weight data feed and the randomness behind the NFT gacha.",
  },
];

const Web3FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.container}>
      {faqData.map((faq, index) => (
        <FAQItem
          key={index}
          title={faq.title}
          content={faq.content}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
};

export default Web3FAQPage;
