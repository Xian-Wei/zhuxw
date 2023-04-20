import React, { useState } from "react";
import styles from "./nftcard.module.scss";
import Image from "next/image";
import LoadingAnimation from "../../LoadingAnimation";

interface NFTCardInterface {
  title: string;
  price: number;
  image: string;
  alt: string;
  approve: () => Promise<boolean | undefined>;
  mint: () => Promise<boolean | undefined>;
  isInteractible: boolean;
}

const NFTCard = ({
  title,
  price,
  image,
  alt,
  approve,
  mint,
  isInteractible,
}: NFTCardInterface) => {
  const [approved, setApproved] = useState(false);
  const [minted, setMinted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onApprove = async () => {
    setIsLoading(true);
    const success = await approve();
    if (success) {
      setApproved(true);
    }
    setIsLoading(false);
  };

  const onMint = async () => {
    setIsLoading(true);
    const success = await mint();
    if (success) {
      setMinted(true);
    }
    setIsLoading(false);
  };

  const MintButton = () => {
    if (isInteractible) {
      if (isLoading) {
        return (
          <div className={styles.disabledButton}>
            <LoadingAnimation />
          </div>
        );
      } else if (approved) {
        if (minted) {
          return <div className={styles.mintButton}>Minted !</div>;
        } else {
          return (
            <div className={styles.mintButton} onClick={onMint}>
              Mint
            </div>
          );
        }
      } else {
        return (
          <div className={styles.mintButton} onClick={onApprove}>
            Approve
          </div>
        );
      }
    } else {
      return <div className={styles.disabledButton}>Not available</div>;
    }
  };

  return (
    <div className={styles.container}>
      <Image
        width={300}
        height={300}
        alt={alt}
        src={image}
        className={styles.image}
      />
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.price}>{price} $ZHU</div>
        <MintButton />
      </div>
    </div>
  );
};

export default NFTCard;
