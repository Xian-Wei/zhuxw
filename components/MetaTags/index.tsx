import React from "react";

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}

const MetaTags = ({
  title,
  description,
  image = `https://zhuxw.com/images/metalogo.png`,
  url,
  type = "website",
}: MetaTagsProps) => {
  return (
    <>
      <meta name="author" content="Xian-Wei Zhu" />
      <meta name="og:title" content={title} />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
};

export default MetaTags;
