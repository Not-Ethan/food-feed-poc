# Food Feed POC

A proof-of-concept web app for a TikTok-style food discovery feed.

## What it does

- scrapes public Uber Eats store pages
- normalizes menu items into a single feed
- renders a vertical, mobile-style discovery UI
- deep-links users out to Uber Eats for ordering
- does **not** handle checkout, carts, or payments

This is deliberately scoped as a **discovery + routing** product.

## Stack

- React
- Vite
- plain CSS
- Node-based scraper using built-in `fetch`

## Local run

```bash
npm install --include=dev
npm run scrape:ubereats
npm run dev
```

## Build

```bash
npm run build
```

## Scraper

The MVP currently scrapes **one platform: Uber Eats**.

Command:

```bash
npm run scrape:ubereats
```

It writes normalized feed data to:

```bash
src/data/feed.json
```

## Current limitations

- public-page scraping is brittle by nature
- item imagery is currently using store hero images when item-level images are unavailable
- no live location or personalization yet
- no checkout or transaction handling

## Obvious next steps

- add more Uber Eats store URLs or make source URLs configurable
- rank items by time of day / cuisine / clicks
- add location-aware filtering
- add support for DoorDash or Grubhub as additional sources
- move from scraped bootstrap inventory to direct restaurant onboarding over time
