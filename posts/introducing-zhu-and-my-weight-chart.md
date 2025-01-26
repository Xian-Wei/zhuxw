---
id: 4
title: "Introducing $ZHU and weight trading"
description: "The very first feature of zhuxw. Speculate on my weight."
image: images/blog/thumbnails/stonks.png
date: "2023-02-27"
tags:
  - zhuxw
  - crypto
  - 2023
---

It has been done. \
At long last this website has utility aside from being a blog where I'm forcing myself
to write posts every month.

## Before anything

This is a Web3 feature meaning this will not work without a crypto wallet (an
[ethereum wallet](https://ethereum.org/en/wallets/) to be precise). \
I'm well aware this is gonna gatekeep 99% of my audience (which currently consists
of 0 people) however I was really eager to dip my toes into the Web3 world and build
a decentralized feature using blockchain technology.

You'll find a quick tutorial somewhere in this post (I don't know yet)
explaining how to get started, create your first self-custodial wallet and
interact with a smart contract.

## What is it about ?

![Not financial advice](/images/blog/4-screenshot.png)

If you're not familiar with the chart above, it's a candlestick chart used by
traders to read price movements of financial assets. \
Green candles represent an increase in price, while red candles represent a decrease.
You'll do just fine knowing this.

What you're seeing on this chart is my weight that I've been keeping track of
since September 2019 on an Excel sheet. \
Yes, I've gained 18.5 kilos in 364 days but that's a story for another time.

There are two concepts to understand before you take on weight trading/gambling
: \
Traders **"short"** and **"long"** assets in order to make profits.

A long trade is a strategy where you bet that the price of an asset will go up
in the future. \
On the other hand, a short trade means you believe the price will nosedive.

Now that you understand these concepts, you may trade all your life savings in
the stock/crypto market and make massive gains to achieve financial freedom. \
**This is not financial advice.**

You may have noticed that I omitted to explain entry/liquidation price and PNL.
This post will be too long if I do, but make sure to know what those are if you
plan on trading real money later on.

FYI you're trading with 20x leverage by default on this website. \
**DYOR** if you want to know what leverage is.

Have fun getting liquidated, you fools.

## The zhuxw official cryptocurrency

I've created a cryptocurrency called $ZHU that you can get for free using the
faucet button in the Chart page. \
This currency is what you'll be using to interact with my trading system, needless
to say it has absolutely no value and there is no need to spam the faucet.

![Zhu Token Logo](/images/blog/4-zhutoken.png)

First off you need a crypto wallet as mentioned before, I recommend using
[MetaMask](https://metamask.io/) because it's the one I used to develop and test
the feature with but any [Ethereum](https://ethereum.org/en/what-is-ethereum/)
wallet that allows you to interact with smart contracts should work (such as
Brave Browser with its wallet or Trust Wallet).

To interact with a [smart contract](https://ethereum.org/en/smart-contracts/)
(code written into a blockchain), you'll need to pay
[fees](https://ethereum.org/en/developers/docs/gas/) in Ethereum.

This may sound technical, but it's essential to understand.

My smart contract is deployed on the Goerli blockchain so you will need to find
a Goerli Ethereum faucet to get ETH to interact with the blockchain. \
You can find a list [here](https://faucetlink.to/goerli).

Have you noticed the unusual amount of external links I've put in the last few
lines ? \
This is me realizing that the Web3 user experience is absolute dogshit and there's
no way the average Joe can understand any of this without proper research.

I'm not gonna bother typing all the details because I suck at explaining. \
**DYOR** if you want to know more.

ZHU currently has no utility and probably never will, I have things in the
pipeline that could potentially use it in the future but no promises.

## Tutorial

These are the steps you need to do next :

- After installing a wallet and acquiring some ETH, a button in the top-right
  corner of the website should appear.
- Click on this button to connect your wallet to the website, allowing you to
  interact with my smart contract.
- Your wallet address will show up if you're connected, and a second button
  should appear.
- Click on the second button and select "Goerli" to switch to the Goerli
  network.
- The trading system and faucet should now be interactible.
- Use the faucet button to receive free ZHU.
- After a successful transaction, your balance will update to display your
  freshly minted ZHU.
- You may now long or short my weight by entering the amount of ZHU you want to
  trade.
- Click on the approve button to initiate the trade.
- Then click on the Short/Long button to send your position to the blockchain
  (note that you're speculating using my current weight as entry price/weight).
- The board below the chart will update and display your position.
- Your gains and losses will change over time as I update my weight on the
  website (I will try to update it daily, but there are no guarantees).
- Your trades will be executed at a later time, probably on Saturdays or Sundays
  every week (once again, there are no guarantees).

## Code for smart contract

I am tired of typing this bullshit so I'm gonna end it here, it's already too
long anyways.

The code for the smart contract is available
[here](https://github.com/Xian-Wei/zhuxw-core/).

Godspeed.
