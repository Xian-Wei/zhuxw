// FaqAccordion.tsx

import React from "react";
import styles from "./web3faq.module.scss";

interface FAQItemProps {
  title: string;
  content: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ title, content }) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemTitle}>{title}</div>
      <div className={styles.itemContent}>{content}</div>
    </div>
  );
};

const Web3FAQ: React.FC = () => {
  const faqData = [
    {
      title: "What is this ?",
      content: "My own trading system built on the blockchain.",
    },
    {
      title: "What do I trade ?",
      content:
        "You trade my weight, betting if I gain or lose weight, using my own cryptocurrency $ZHU.",
    },
    {
      title: "What do I need to start trading ?",
      content:
        "An Ethereum wallet, I recommend using Metamask or the integrated wallet in the Brave Browser.",
    },
    {
      title: "How do I get $ZHU ?",
      content:
        "Click on the faucet button located next to the trade button to receive free $ZHU.",
    },
    {
      title: "A tutorial would be nice.",
      content: "https://www.zhuxw.com/post/introducing-zhu-and-my-weight-chart",
    },
    {
      title: "It's not working.",
      content:
        "Ensure you have enough ETH/MATIC to cover gas fees and sufficient $ZHU for the trade.",
    },
    {
      title: "Why ?",
      content:
        "To be able to claim my very own NFT collection in the Shop section.",
    },
    {
      title: "What is the Zhuba NFT Gacha ?",
      content:
        "Zhuba NFTs come in 5 different rarities. Spending 10,000 $ZHU will send an NFT of random rarity your way.",
    },
    {
      title: "How does it work under the hood ?",
      content:
        "The smart contracts were developed using Solidity and Chainlink.",
    },
  ];

  return (
    <div className={styles.container}>
      {faqData.map((faq, index) => (
        <FAQItem key={index} title={faq.title} content={faq.content} />
      ))}
    </div>
  );
};

export default Web3FAQ;
