---
id: 1
title: "AI Revamped My Website in Two Hours"
description: "I gave Claude a vague brief and walked away. Two hours later, my site looked completely different."
image: "/images/metalogo.png"
date: "2026-05-18"
tags: ["dev", "AI"]
---

I've been meaning to redesign this site for months. The layout worked, the features were there, but it felt dated — flat, a bit cold, no visual personality. Every time I sat down to fix it I'd spend 20 minutes tweaking one button color and then give up.

So I tried something different. I opened Claude Code, described what I wanted in broad strokes — *glassmorphism, something darker, more alive* — and just let it go.

## What actually changed

The scope ended up being larger than I expected. In roughly two hours of back-and-forth:

- Every page got a glass card treatment: `backdrop-filter`, subtle gradient borders, dark translucent backgrounds
- The FAQ went from a broken static list to a proper accordion with chevron animations
- The shop page was restructured entirely — GIF separated from the info panel, rarity rates added with colored bars
- The AI chat page was rewritten from scratch after the SDK stopped cooperating. Manual `fetch` + `ReadableStream` instead, works on mobile now
- The loading screen was swapped out (then swapped back when I didn't like what it chose)
- The 3D home page tabs got invisible hit boxes so they're actually clickable
- A Snake game appeared on the dev page

Some of these I asked for directly. Some came from Claude noticing something felt off and suggesting a fix.

## What surprised me

The speed is the obvious part. But what actually caught me off guard was how little I had to specify. "The FAQ is broken" was enough context for it to diagnose the `flex-shrink` issue causing content to clip, fix it, and move on. I didn't have to explain the CSS model.

It also pushed back occasionally in useful ways — when I asked for the 3D letters to face the camera, it flagged that the hover interaction would break, and it was right. When I asked about AI providers, it walked me through Groq as a free alternative before I'd even asked for options.

The loop of *describe → review → redirect* felt more like pairing with someone than typing commands.

## Where it still needed me

Direction. Claude is good at execution and decent at suggesting next steps, but it doesn't know what the site is *for* or what aesthetic actually fits. The glassmorphism direction came from me. The decision to revert the loader came from me. The win condition on the snake game went through three iterations because "good enough" is a judgment call, not a computation.

It also can't test UI in a real browser, which means some mobile issues only surfaced when I actually picked up my phone. The AI chat keyboard-dismiss bug took a few rounds to nail down because the failure mode only happens on a physical device.

## Would I do it again

Already have been. It's changed what feels worth doing — things that used to seem too small to bother with (a better empty state, syncing a comment between two files) now take 30 seconds. Things that seemed too large to start (a full page redesign) now have a natural entry point.

The site still needs work. But now that work actually gets done.
